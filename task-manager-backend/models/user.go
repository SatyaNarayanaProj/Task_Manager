package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
    ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Username string             `bson:"username" json:"username" validate:"required,min=3"`
    Email    string             `bson:"email" json:"email" validate:"required,email"`
    Password string             `bson:"password" json:"password" validate:"required,min=6"`
}