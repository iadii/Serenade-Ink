const Blog = require('../models/blog');

// Create a new blog (user-specific)
exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        const newBlog = new Blog({ 
            title, 
            content, 
            author: req.user.name 
        });
        
        await newBlog.save();
        
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's blogs only
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.name })
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single blog by ID (user's blog only)
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findOne({ 
            _id: req.params.id, 
            author: req.user.name 
        });
        
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a blog (user's blog only)
exports.updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        const updatedBlog = await Blog.findOneAndUpdate(
            { 
                _id: req.params.id, 
                author: req.user.name 
            },
            { 
                title, 
                content 
            },
            { new: true }
        );
        
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a blog (user's blog only)
exports.deleteBlog = async (req, res) => {
    try {
        const deleted = await Blog.findOneAndDelete({ 
            _id: req.params.id, 
            author: req.user.name 
        });
        
        if (!deleted) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};