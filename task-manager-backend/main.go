package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yourusername/task-manager/config"
	"github.com/yourusername/task-manager/controllers"
	"github.com/yourusername/task-manager/middleware"
)

func main() {
	// Initialize Gin
	router := gin.Default()

	// Connect to Database
	config.ConnectDB()

	// Setup CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://task-manager-seven-weld-99.vercel.app"}, // your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public routes
	authGroup := router.Group("/auth")
	{
		authGroup.POST("/signup", controllers.Signup) 
		authGroup.POST("/login", controllers.Login)
	}

	// Protected routes
	apiGroup := router.Group("/api")
	apiGroup.Use(middleware.AuthMiddleware()) 
	{
		tasks := apiGroup.Group("/tasks")
		{
			tasks.POST("", controllers.CreateTask)       
			tasks.GET("", controllers.GetTasks)         
			tasks.PUT("/:id", controllers.UpdateTask)    
			tasks.DELETE("/:id", controllers.DeleteTask) 
		}
	}

	// Start server
	log.Println("Starting server on :8080...")
	err := router.Run(":8080")
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
