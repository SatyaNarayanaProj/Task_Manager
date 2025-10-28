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
    AllowOrigins:     []string{"https://task-manager-seven-weld-99.vercel.app"}, 
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public routes
	authGroup := router.Group("/auth")
	{
		authGroup.POST("/signup", controllers.Signup())
		authGroup.POST("/login", controllers.Login())
	}

	// Protected routes
	apiGroup := router.Group("/api")
	apiGroup.Use(middleware.AuthMiddleware()) // Apply JWT auth middleware
	{
		tasks := apiGroup.Group("/tasks")
		{
			tasks.POST("", controllers.CreateTask())       // POST /api/tasks
			tasks.GET("", controllers.GetTasks())          // GET /api/tasks
			tasks.PUT("/:id", controllers.UpdateTask())    // PUT /api/tasks/:id
			tasks.DELETE("/:id", controllers.DeleteTask()) // DELETE /api/tasks/:id
		}
	}

	// Start server
	log.Println("Starting server on :8080...")
	router.Run(":8080")
}
