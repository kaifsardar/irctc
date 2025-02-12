# Train Booking API
[Watch API Demo](https://drive.google.com/file/d/1UaypeCTqggt5TwxfPAWPSUuQRrZ0lUzY/view?usp=share_link)
## Prerequisites


- **MySQL** (up and running)
- **Node.js**


### Database Setup

run using the MySQL CLI or MySQL Workbench.
```sql
CREATE DATABASE irctc;
USE irctc;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    trainId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (trainId) REFERENCES trains(id)
);

```

->Provide the below credentials in a `.env`

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_NAME=irctc
   DB_USER=root
   DB_PASS=Kaif@100
   JWT_SECRET=supersecret
   ADMIN_API_KEY=Kaif@Admin@100
   ```

### Running the Application

1. Clone :
   ```sh
   git clone https://github.com/kaifsardar/irctc.git
   cd irctc
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the app:
   ```sh
   npm run start
   ```
   **or**
   ```sh
   node index.js
   ```

## 📌 API Endpoints

### 1. Admin - Add Train (Requires API Key in Header)
**POST** `http://localhost:3000/admin/train`

**Headers:**
```json
{
    "api-key": "Kaif@Admin@100"
}
```
**Body:**
```json
{
    "name": "Rajdhani Express",
    "source": "Sealdah",
    "destination": "Delhi"
    "totalSeats" : 670
}
```
**Response:**
```json
{
    "message": "Train added",
    "train": {
        "id": 12,
        "name": "Rajdhani Express",
        "source": "Sealdah",
        "destination": "Delhi",
        "totalSeats": "670"
    }
}
```

###  2. User Registration
**POST** `http://localhost:3000/auth/register`

**Body:**
```json
{
    "name": "Kaif Sardar",
    "email": "kaif@gmail.com",
    "password": "mypassword"
}
```
**Response:**
```json
{
    "message": "User registered successfully",
    "details": {
        "userId": 6,
        "name": "Kaif Sardar",
        "email": "kaif@gmail.com"
    }
}
```

###  3. User Login
**POST** `http://localhost:3000/auth/login`

**Body:**
```json
{
    "email": "kaif@gmail.com",
    "password": "mypassword"
}
```
 **Response:**
```json
{
    "message": "Login successful",
    "token": "<JWT_TOKEN>"
}
```
Save the JWT Token for future requests.

###  4. Get Available Trains (Requires Token)
**GET** `http://localhost:3000/trains/?source=Sealdah&destination=Delhi`

**Headers:**
```json
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Response:**
```json
[
    {
        "trainId": 2,
        "name": "rajdhani",
        "available_seats": 980
    },
    {
        "trainId": 12,
        "name": "Rajdhani Express",
        "available_seats": 670
    }
]
```

###  5. Book a Train Ticket (Requires Token)
**POST** `http://localhost:3000/booking`

**Headers:**
```json
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Body:**
```json
{
    "trainId": 1
}
```
**Response:**
```json
{
    "message": "Seat booked"
}
```

###  6. View User's all Bookings (Requires Token)
**GET** `http://localhost:3000/booking/`

**Headers:**
```json
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Response:**
```json
{
    "userId": 6,
    "bookings": [
        {
            "bookingId": 10,
            "trainId": 12
        }
    ]
}
```

###  7. Get a perticular Booking Details (Requires Token)
**GET** `http://localhost:3000/booking/:bookingId`

**Headers:**
```json
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Response:**
```json
{
    "user": "Kaif Sardar1",
    "email": "kaifsardar1@yahoo.com",
    "train": "Rajdhani Express",
    "trainId": 12,
    "bookingId": 10,
    "userId": 6,
    "source": "Sealdah",
    "destination": "Delhi"
}
```
