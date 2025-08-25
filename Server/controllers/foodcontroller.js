//import all the libraries we need
const FoodPost = require("../models/foodpost");
const { cloudinary } = require("../config/cloudinary");

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

//=============================
//1.Create food post
//=============================
const createFood = async (req, res) => {
  try {
    console.log("Creating a new food post....");

    let body = { ...req.body };

    Object.keys(body).forEach((key) => {
      if (typeof body[key] === "string") {
        body[key] = body[key].replace(/^"(.*)"$/, "$1");
      }
    });

    // Parse location if sent as JSON string (from form-data)
    if (body.location && typeof body.location === "string") {
      try {
        body.location = JSON.parse(body.location);
      } catch (e) {
        body.location = {};
      }
    }

    if (!body.location) {
      body.location = {
        address: body["location.address"] || body.address,
        city: body["location.city"] || body.city,
        state: body["location.state"] || body.state,
        zipCode: body["location.zipCode"] || body.zipCode,
      };
    }

    // Convert types properly
    if (body.isVegetarian !== undefined) {
      body.isVegetarian =
        body.isVegetarian === "true" || body.isVegetarian === true;
    }
    if (body.isVegan !== undefined) {
      body.isVegan = body.isVegan === "true" || body.isVegan === true;
    }
    if (body.quantity) {
      body.quantity = Number(body.quantity);
    }
    if (body.availableUntil) {
      body.availableUntil = new Date(body.availableUntil);
    }

    // Extract data safely from normalized body
    const {
      title,
      description,
      foodtype,
      quantity,
      location,
      availableUntil,
      pickupTimePreference,
      specialInstructions,
      contactInfo,
      isVegetarian,
      isVegan,
    } = body;

    //check if required fields are provided
    if (
      !title ||
      !foodtype ||
      !quantity ||
      !location?.address ||
      !availableUntil
    ) {
      return res.status(400).json({
        error:
          "Missing required fields:title,foodtype,quantity,location.address,availableUntil",
      });
    }

    //process upload images(if any)
    let processedImages = [];
    if (req.files && req.files.length > 0) {
      console.log("processing${req.files.length}uploaded images....");
      processedImages = req.files.map((file) => ({
        url: file.path, //cloudinary url
        publicId: file.filename, //for deletion later
      }));
    }

    //create the food post object
    const foodpostData = {
      title: title.trim(),
      description: description?.trim(),
      foodtype,
      quantity: Number(quantity),
      location: {
        address: location.address.trim(),
        city: location.city?.trim(),
        state: location.state?.trim(),
        zipCode: location.zipCode?.trim(),
        coordinates: location.coordinates || {},
      },
      images: processedImages,
      donor: req.user.id || req.user.userId, //This comes from auth auth middleware
      availableUntil: new Date(availableUntil),
      pickupTimePreference: pickupTimePreference || "anytime",
      specialInstructions: specialInstructions?.trim(),
      contactInfo: contactInfo || {},
      isVegetarian: isVegetarian === true || isVegetarian === "true",
      isVegan: isVegan === true || isVegan === "true",
    };

    //save to database
    console.log("saving to database...");
    const newFoodPost = new FoodPost(foodpostData);
    const savedFoodPost = await newFoodPost.save();

    console.log("Food post created successfully");

    //send success response
    res.status(201).json({
      message: "Food Post Created Successfully!",
      foodPost: savedFoodPost,
      imageCount: processedImages.length,
    });
  } catch (error) {
    console.error("Error Creating food post:", error);

    //if food post creation fails,delete uploaded images to avoid clutter
    if (req.files && req.files.length > 0) {
      console.log("Cleaning up uploaded images....");
      for (const file of req.files) {
        try {
          await deleteImage(file.filename);
        } catch (deleteError) {
          console.error("Error deleting image:", deleteError);
        }
      }
    }

    res.status(500).json({
      error: "Failed to create food post",
      details: error.message,
    });
  }
};

//=============================
//2.Get all food posts
//=============================

const getAllFood = async (req, res) => {
  try {
    console.log("Fetching all food posts....");

    //build query filters from url parameters
    const filters = {}; // Start with no filters

    // Default filter: only show available food for non-admin users
    if (!req.user || req.user.role !== "admin") {
      filters.status = "available";
    }

    //add optional filters
    if (req.query.foodtype) {
      filters.foodtype = req.query.foodtype;
    }

    if (req.query.city) {
      filters["location.city"] = new RegExp(req.query.city, "i"); //case insensitive search
    }

    if (req.query.isVegeterian === "true") {
      filters.isVegeterian = true;
    }

    // Status filter (admin can filter by status)
    if (
      req.query.status &&
      (req.user?.role === "admin" || req.query.status === "available")
    ) {
      filters.status = req.query.status;
    }

    //pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("Applied filters: ", filters);

    //fetch food posts from database
    const foodPosts = await FoodPost.find(filters)
      .populate("donor", "name email phone") //Get donor info
      .populate("assignedNGO", "name organizationName")
      .populate("assignedVolunteer", "name phone area")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    //get total count for pagination
    const totalPosts = await FoodPost.countDocuments(filters);
    const totalPages = Math.ceil(totalPosts / limit);

    console.log("Found${foodPosts.length}food posts");

    res.status(200).json({
      message: "Food posts fetched successfully",
      foodPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filtersApplied: filters,
    });
  } catch (error) {
    console.error("Error Fetching food posts", error);
    res.status(500).json({
      error: "Failed to fetch food posts",
      details: error.message,
    });
  }
};

//=============================
//3.Get single food posts
//=============================

const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching food post with ID:${id}");

    //find food post by ID
    const foodPost = await FoodPost.findById(id)
      .populate("donor", "name email phone location")
      .populate("assignedNGO", "name organizationName phone email")
      .populate("assignedVolunteer", "name phone");

    if (!foodPost) {
      return res.status(404).json({
        error: "Food post not found",
      });
    }

    //increment view count5
    foodPost.views += 1;
    await foodPost.save();

    console.log("Food post found and view count updated");

    res.status(200).json({
      message: "Food post fetched successfully",
      foodPost,
    });
  } catch (error) {
    console.error("Error fecthing food post", error);

    //handle invalid MongoDB ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid food post Id Format",
      });
    }

    res.status(500).json({
      error: "Failed to fetch food post",
      deatils: error.message,
    });
  }
};

//=============================
//4.update food post
//=============================

const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating food post with ID: ${id}`);

    // First check if user is authenticated
    if (!req.user || (!req.user.id && !req.user.userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in first",
      });
    }

    const userId = req.user.id || req.user.userId;
    console.log(`Update requested by user: ${userId} (Role: ${req.user.role})`);

    // Find the existing food post
    const existingFood = await FoodPost.findById(id);
    if (!existingFood) {
      return res.status(404).json({
        success: false,
        message: "Food post not found",
      });
    }

    // Check if user owns this food post or is admin/NGO
    if (existingFood.donor) {
      // If food post has donor, check ownership
      if (
        existingFood.donor.toString() !== userId &&
        !["admin", "ngo"].includes(req.user.role)
      ) {
        console.log("User not authorized to update this post");
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this food post",
        });
      }
    } else {
      // If no donor information, only allow admin to update
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Only admins can update food posts without donor information",
        });
      }
    }

    // Get update data
    let updateData = { ...req.body };

    // Clean up string values (remove quotes if they exist)
    Object.keys(updateData).forEach((key) => {
      if (typeof updateData[key] === "string") {
        updateData[key] = updateData[key].replace(/^"(.*)"$/, "$1");
      }
    });

    // Parse location if sent as JSON string
    if (updateData.location && typeof updateData.location === "string") {
      try {
        updateData.location = JSON.parse(updateData.location);
      } catch (e) {
        console.log("Error parsing location:", e);
        // Keep original location if parsing fails
      }
    }

    // Convert boolean and number fields
    if (updateData.isVegetarian !== undefined) {
      updateData.isVegetarian =
        updateData.isVegetarian === "true" || updateData.isVegetarian === true;
    }
    if (updateData.isVegan !== undefined) {
      updateData.isVegan =
        updateData.isVegan === "true" || updateData.isVegan === true;
    }
    if (updateData.quantity) {
      updateData.quantity = Number(updateData.quantity);
    }
    if (updateData.availableUntil) {
      updateData.availableUntil = new Date(updateData.availableUntil);
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} new images...`);

      const newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

      // Add new images to existing ones
      updateData.images = [...(existingFood.images || []), ...newImages];
    }

    // Update the updatedAt timestamp
    updateData.updatedAt = new Date();

    console.log("Saving updates...");

    // Update the food post
    const updatedFood = await FoodPost.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run model validations
    })
      .populate("donor", "name email phone")
      .populate("assignedNGO", "name email phone organizationName")
      .populate("assignedVolunteer", "name phone area");

    console.log("Food post updated successfully");

    res.status(200).json({
      success: true,
      message: "Food post updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    console.error("Error updating food post:", error);

    // Handle invalid MongoDB ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid food post ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update food post",
      error: error.message,
    });
  }
};
//=============================
//5.Delete food post
//=============================

const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Attempting to delete food post with ID: ${id}`);

    // Find the food post
    const foodPost = await FoodPost.findById(id);
    if (!foodPost) {
      return res.status(404).json({
        success: false,
        message: "Food post not found",
      });
    }

    // Check authorization
    const userId = req.user.id || req.user.userId;
    if (foodPost.donor) {
      // If food post has donor, check ownership
      if (
        foodPost.donor.toString() !== userId &&
        !["admin"].includes(req.user.role)
      ) {
        console.log("User not authorized to delete this post");
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this food post",
        });
      }
    } else {
      // If no donor information, only allow admin to delete
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Only admins can delete food posts without donor information",
        });
      }
    }

    // Check if food is already accepted/picked up
    if (["accepted", "picked_up"].includes(foodPost.status)) {
      console.log("Cannot delete food that is already accepted or picked up");
      return res.status(400).json({
        success: false,
        message: "Cannot delete food that is already accepted or picked up",
      });
    }

    // Delete associated images from Cloudinary
    if (foodPost.images && foodPost.images.length > 0) {
      console.log(`Deleting ${foodPost.images.length} images from cloud...`);

      const publicIds = foodPost.images.map((img) => img.publicId);
      try {
        await Promise.all(publicIds.map((id) => deleteImage(id)));
        console.log("Images deleted successfully");
      } catch (imageError) {
        console.error("Some images could not be deleted:", imageError);
        // Continue with deletion even if some images fail
      }
    }

    // Delete the food post
    await FoodPost.findByIdAndDelete(id);
    console.log("Food post deleted successfully");

    res.status(200).json({
      success: true,
      message: "Food post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting food post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete food post",
      error: error.message,
    });
  }
};

// Export all functions for use in routes
module.exports = {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
};

console.log("Food Controller loaded with 8 functions:");
console.log("- createFood: Create new food posts");
console.log("- getAllFood: Get all food posts with filtering");
console.log("- getFoodById: Get specific food post");
console.log("- updateFood: Update existing food post");
console.log("- deleteFood: Delete food post");
