const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const favorite = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    // Return formatted payload without structural _id / url wrappers if specified by instructions.
    // The course says "returns the blog with most likes", returning the whole object is fine.
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    // countBy: groups array by author, returns object: { 'Author Name': count, 'Author 2': count }
    const authorCounts = _.countBy(blogs, 'author')

    // map: convert it to an array of objects: { author: '...', blogs: count }
    const authorArray = _.map(authorCounts, (count, author) => ({
        author: author,
        blogs: count
    }))

    // maxBy: find the one with the highest count
    return _.maxBy(authorArray, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    // groupBy: groups blogs by author -> { 'Author 1': [{blog1}, {blog2}], ... }
    const blogsByAuthor = _.groupBy(blogs, 'author')

    // map: convert directly to { author: '...', likes: groupedLikesSum }
    const likesArray = _.map(blogsByAuthor, (authorBlogs, author) => ({
        author: author,
        likes: totalLikes(authorBlogs) // reusing our own totalLikes function!
    }))

    return _.maxBy(likesArray, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
