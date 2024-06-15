# Library Management System

This project is a library management system that includes  a RESTful API built with Node.js, Express, and MongoDB. The system handles user management, book management, and a borrowing system.

## Features

### User Management

- **User Registration:** Users can register with their name, email, and password.
- **User Login:** Users can log in using their email and password.
- **User Roles:** There are two roles – Admin and Member. Admins can perform all operations, while Members have restricted access.

### Book Management

- **Add Book:** Admins can add new books with details like title, author, ISBN, publication date, genre, and number of copies.
- **Update Book:** Admins can update book details.
- **Delete Book:** Admins can delete a book from the library.
- **List Books:** All users can view the list of books with pagination and filtering options (e.g., by genre, author).

### Borrowing System

- **Borrow Book:** Members can borrow a book, ensuring the book is available (copies > 0).
- **Return Book:** Members can return a borrowed book.
- **Borrow History:** Members can view their borrowing history.

### Reports and Aggregations

- **Most Borrowed Books:** Generate a report of the most borrowed books.
- **Active Members:** List the most active members based on borrowing history.
- **Book Availability:** Provide a summary report of book availability (total books, borrowed books, available books).

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- npm (Node Package Manager)

## Setup

1. **Clone the repository:**

   ```bash
   git remote add origin https://github.com/Niranjan8688/Nalanda.git
   cd library-management-system
