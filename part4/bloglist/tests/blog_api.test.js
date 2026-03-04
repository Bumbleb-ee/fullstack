const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json and there are right amount of them', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('Canonical string reduction'))
})

test('if likes property is missing, it will default to 0', async () => {
    const newBlog = {
        title: 'Test blog without likes',
        author: 'Test Author',
        url: 'http://testurl.com'
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test('backend responds with 400 Bad Request if title or url is missing', async () => {
    const newBlogWithoutTitle = {
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400)

    const newBlogWithoutUrl = {
        title: 'Test Title',
        author: 'Test Author',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400)
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({})

        assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))
    })
})

describe('updating a blog', () => {
    test('succeeds in updating the likes of a valid blog', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToUpdate = blogsAtStart[0]

        const updatedBlogData = {
            ...blogToUpdate.toJSON(),
            likes: blogToUpdate.likes + 10
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlogData)
            .expect(200)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)

        const blogsAtEnd = await Blog.find({})
        const verifyBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
        assert.strictEqual(verifyBlog.likes, blogToUpdate.likes + 10)
    })
})

after(async () => {
    await mongoose.connection.close()
})
