import User from "../schema/userModule.js";

export const fetch = async (req, res) => {
    try {
        const { name, email, page = 1, limit = 10 } = req.query;

        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort: { name: 1 }, // Sorting by name in alphabetical order (ascending)
        };

        const users = await User.find(query, null, options);
        const totalUsers = await User.countDocuments(query);

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            users,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const create = async (req, res) => {
    try {
        const userData = new User(req.body);
        const { email } = userData;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        const savedUser = await userData.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
