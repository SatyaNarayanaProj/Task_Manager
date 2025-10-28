package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Task struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title" validate:"required"`
	Description string             `bson:"description,omitempty" json:"description"`
	Completed   bool               `bson:"completed" json:"completed"`
	DueDate     *time.Time         `bson:"dueDate,omitempty" json:"dueDate"`
	UserID      primitive.ObjectID `bson:"userId" json:"userId"` // Link to the user
}
