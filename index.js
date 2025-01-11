const { initializeDatabase } = require("./db/db.connect")
const express = require("express")
const app = express()
app.use(express.json())
initializeDatabase()
const cors = require("cors");
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const Hotel = require("./models/hotel.models")


const seedData = async(hotelObj) => {
    try {
        const hotel = new Hotel(hotelObj)
        const addedHotel = await hotel.save()
        return addedHotel
    } catch (error) {
        throw error
    }
}

app.post("/hotels", async(req, res) => {
    try {
        const hotel = await seedData(req.body)
        res.status(201).json({ message: "Hotel added successfully", hotel: hotel })
    } catch (error) {
        res.status(500).json({ error: "Cannot fetch hotels" })
    }
})

const allHotels = async() => {
    try {
        const hotels = await Hotel.find()
        return hotels

    } catch (error) {
        throw error
    }
}

app.get("/hotels", async(req, res) => {
    try {
        const hotels = await allHotels()
        if (hotels.length !== 0) {
            res.json(hotels)
        } else {
            res.status(404).json({ error: "Hotels Dont Exist" })
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching hotels." })
    }
})


const hotelByName = async(hotelName) => {

    try {
        const hotel = await Hotel.findOne({ name: hotelName })
        return hotel
    } catch (error) {
        throw error
    }
}

app.get("/hotels/:hotelName", async(req, res) => {
    try {
        const hotel = await hotelByName(req.params.hotelName)
        if (hotel) {
            res.json(hotel)
        } else {
            res.status(404).json({ error: "Hotel Not Found" })
        }
    } catch (error) {
        res.status(500).json({ error: "Cannot fetch Hotels" })
    }
})

const hotelsWithParkingSpace = async() => {
    try {
        const hotels = await Hotel.find({ isParkingAvailable: true })
        console.log(hotels)
    } catch (error) {
        throw error
    }
}

const hotelsWithRestaurant = async() => {
    try {
        const hotels = await Hotel.find({ isRestaurantAvailable: true })
        console.log(hotels)
    } catch (error) {
        throw error
    }
}

const hotelsWithCategory = async(category) => {
    try {
        const hotels = await Hotel.find({ category: category })
        return hotels
    } catch (error) {
        throw error
    }
}

app.get("/hotels/category/:hotelCategory", async(req, res) => {
    try {
        const hotels = await hotelsWithCategory(req.params.hotelCategory)
        if (hotels.length !== 0) {
            res.json(hotels)
        } else {
            res.status(404).json({ error: "Hotels Not Found" })
        }
    } catch (error) {
        res.status(500).json({ error: "Cannot fetch hotels" })
    }
})

const hotelsPriceRange = async(priceRange) => {
    try {
        const hotels = await Hotel.find({ priceRange: priceRange })
        console.log(hotels)
    } catch (error) {
        throw error
    }
}

const hotelsWithRating = async(rating) => {
    try {
        const hotels = await Hotel.find({ rating: rating })
        return hotels
    } catch (error) {
        throw error
    }
}

app.get("/hotels/rating/:hotelRating", async(req, res) => {
    try {
        const hotels = await hotelsWithRating(req.params.hotelRating)
        if (hotels.length !== 0) {
            res.json(hotels)
        } else {
            res.status(404).json({ error: "Hotels Not Found" })
        }
    } catch (error) {
        res.status(500).json({ error: "Cannot fetch Hotels" })
    }
})

const hotelByPhone = async(phoneNum) => {
    try {
        const hotel = await Hotel.findOne({ phoneNumber: phoneNum })
        return hotel
    } catch (error) {
        throw error
    }
}

app.get("/hotels/directory/:phoneNumber", async(req, res) => {
    try {
        const hotel = await hotelByPhone(req.params.phoneNumber)
        if (hotel) {
            res.json(hotel)
        } else {
            res.status(404).json({ error: "Hotel Not Found" })
        }
    } catch (error) {
        res.status(500).json({ error: "cannot fetch hotels" })
    }
})



const updateData = async(hotelId, dataToUpdate) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, { new: true })
        return hotel
    } catch (error) {
        console.log("an error occured while updating data", error)
    }
}

app.post("/hotels/:hotelId", async(req, res) => {
    try {
        const updatedHotel = await updateData(req.params.hotelId, req.body)
        if (updatedHotel) {
            res.status(200).json({ message: "Hotel updated successfully", hotel: updatedHotel })
        } else {
            res.status(404).json({ error: "Hotel Not Found" })
        }
    } catch (error) {
        res.status(500).json({ error: "Cannot Update Hotel" })
    }
})

async function updateData2(hotelName, dataToUpdate) {
    try {
        const movie = await Hotel.findOneAndUpdate({ name: hotelName }, dataToUpdate, { new: true })
        console.log(movie)
    } catch (error) {
        console.log("an error occured while updating data", error)
    }
}

async function updateData3(phoneNum, dataToUpdate) {
    try {
        const hotel = await Hotel.findOneAndUpdate({ phoneNumber: phoneNum }, dataToUpdate, { new: true })
        console.log(hotel)
    } catch (error) {
        console.log("an error occured while updating data", error)
    }

}

async function deleteHotelById(hotelId) {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
        return deletedHotel
    } catch (error) {
        console.log("an error occured while deleting data", error)
    }
}

app.delete("/hotels/:hotelId", async(req, res) => {
    try {
        const hotelDeleted = await deleteHotelById(req.params.hotelId)
        if (hotelDeleted) {
            res.status(200).json({ message: "Hotel deleted successfully" })
        }
    } catch (error) {
        res.status(500).json({ error: "Cant delete hotel" })
    }
})

async function deleteHotelByPhoneNumber(phoneNum) {
    try {
        const deletedHotel = await Hotel.findOneAndDelete({ phoneNumber: phoneNum })
        console.log(deletedHotel)
    } catch (error) {
        console.log("an error occured while deleting data", error)
    }
}
// initializeDatabase().then(() => seedData(newHotel))

const PORT = 3000

app.listen(PORT, () => {
    console.log("Server is running on PORT: ", PORT)
})