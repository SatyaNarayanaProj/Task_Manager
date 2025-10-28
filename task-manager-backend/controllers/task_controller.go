package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin" // <-- 1. IMPORT VALIDATOR
	"github.com/yourusername/task-manager/config"
	"github.com/yourusername/task-manager/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateTask() gin.HandlerFunc {
	return func(c *gin.Context) {
		var taskCollection = config.GetCollection("tasks")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		var task models.Task

		// 1. Bind JSON
		if err := c.BindJSON(&task); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 2. Validate input
		if err := validate.Struct(task); err != nil { // <-- This will now work
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 3. Get user ID from middleware context
		userIDStr, _ := c.Get("userId")
		userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))

		task.ID = primitive.NewObjectID() // Set new ID
		task.UserID = userID
		task.Completed = false

		// 4. Insert task
		result, err := taskCollection.InsertOne(ctx, task)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Task created", "taskId": result.InsertedID})
	}
}

func GetTasks() gin.HandlerFunc {
	return func(c *gin.Context) {
		var taskCollection = config.GetCollection("tasks")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		var tasks []models.Task

		// Get user ID from context
		userIDStr, _ := c.Get("userId")
		userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))

		// Find tasks for this user
		cursor, err := taskCollection.Find(ctx, bson.M{"userId": userID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tasks"})
			return
		}
		defer cursor.Close(ctx)

		if err = cursor.All(ctx, &tasks); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode tasks"})
			return
		}

		// Handle case where user has no tasks
		if tasks == nil {
			tasks = []models.Task{}
		}

		c.JSON(http.StatusOK, tasks)
	}
}

func UpdateTask() gin.HandlerFunc {
	return func(c *gin.Context) {
		var taskCollection = config.GetCollection("tasks")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// 1. Get task ID from URL
		taskID, _ := primitive.ObjectIDFromHex(c.Param("id"))
		// 2. Get user ID from context
		userID, _ := primitive.ObjectIDFromHex(c.MustGet("userId").(string))

		// 3. Bind JSON for updates
		var updates bson.M
		if err := c.BindJSON(&updates); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid update data"})
			return
		}

		// Security: Don't allow changing ownership or ID
		delete(updates, "userId")
		delete(updates, "_id")

		// 4. Create filter to update task ONLY if it belongs to the user
		filter := bson.M{
			"_id":    taskID,
			"userId": userID,
		}

		// 5. Perform the update
		update := bson.M{"$set": updates}
		result, err := taskCollection.UpdateOne(ctx, filter, update)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found or user not authorized"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Task updated"})
	}
}

func DeleteTask() gin.HandlerFunc {
	return func(c *gin.Context) {
		var taskCollection = config.GetCollection("tasks")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// 1. Get task ID and user ID
		taskID, _ := primitive.ObjectIDFromHex(c.Param("id"))
		userID, _ := primitive.ObjectIDFromHex(c.MustGet("userId").(string))

		// 2. Create filter to ensure user ownership
		filter := bson.M{
			"_id":    taskID,
			"userId": userID,
		}

		// 3. Delete
		result, err := taskCollection.DeleteOne(ctx, filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
			return
		}

		if result.DeletedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found or user not authorized"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
	}
}
