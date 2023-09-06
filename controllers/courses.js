import express from 'express'
import mongoose from 'mongoose'
import Courses from '../models/courseModel.js'
console.log(Courses);
import { v4 as uuidv4 } from 'uuid'
import Redis from 'redis'

const router = express.Router()

// const redisClient = Redis.createClient();
// const DEFAULT_EXPIRATION = 3600;

// redisClient.on('connect', function () {
//     console.log('Connected to redis!');
// });
// redisClient.connect();

router.use(express.json())
// router.use(express.urlencoded({extended: false}))

//routes

export const home =  (req, res) => {
    res.send('Hello NODE API')
}

export const getCourses = async (req, res) => {
    try {

        const { name, author } = req.query;

        // console.log("logging")
        // console.log(req.query)
        // console.log(name)
        // console.log(author)

        const queryObject = {};
        console.log(queryObject)
        if (name) {
            queryObject.name = { $regex: name, $options: 'i' }
        }

        console.log(queryObject)
        if (author) {
            queryObject.author = author;
        }

        console.log(queryObject)

        const cor = await Courses.find(queryObject);

        res.status(200).json({ cor });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// export const getCourse = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const course = await Courses.findById(id);

//         const uid = course.uid;

        // console.log(course);
        // console.log(redView);

        // console.log(uid + ' uiui ')

        // let redView = uid + 'views';
        // let redLikes = uid + 'likes';

        // const views = await redisClient.incr(redView, function (err, rep) {
        //     if (!err) console.log(rep);
        //     else console.log(err);
        // });

        // let condition;
        // if(condition){
        //     const likes = await redisClient.incr(redLikes, function(err, rep) {
        //         if (!err) console.log(rep);
        //         else console.log(err);
        //       });
        // }
        // const likes = await redisClient.get(redLikes);

//         res.status(200).json({ course, views, likes }); //
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }

// create a course
export const createCourse = async (req, res) => {
    try {

        req.body.uid = uuidv4();


        const course = await Courses.create(req.body)
        const redLikes = req.body.uid + 'likes';
        const redViews = req.body.uid + 'views';

        // const replyLikes = await redisClient.set(redLikes, 0, function (err, rep) {
        //     if (!err) console.log(rep + ' ep ');
        //     else console.log(err);
        // });

        // const replyViews = await redisClient.set(redViews, 0, function (err, rep) {
        //     if (!err) console.log(rep + ' ep ');
        //     else console.log(err);
        // });

        // console.log(replyLikes + "  " + replyViews)

        //   const likes = await redisClient.get(redLikes);
        //   console.log(likes + ' ikykykyk ');

        res.status(200).json(course);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
} 

// like 


export const likeCourse = async (req, res) => {
    try {
      const { itemId, userId } = req.body;
  
      // Implement authentication if needed
      // if (!req.userId) return res.status(401).json({ message: 'Unauthenticated' });
  
      console.log(itemId, userId);
      
      // Check if the course with the given itemId exists
      const course = await Courses.findById(itemId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const index = course.likeCount.findIndex((id) => id === String(userId));
      if (index === -1) {
        course.likeCount.push(String(userId));
      } else {
        course.likeCount = course.likeCount.filter((id) => id !== String(userId));
      }
  
      const updatedCourse = await Courses.findByIdAndUpdate(itemId, course, { new: true });
  
      res.json(updatedCourse);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
// update a course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Courses.findByIdAndUpdate(id, req.body);
        // we cannot find any course in database
        if (!course) {
            return res.status(404).json({ message: `cannot find any course with ID ${id}` })
        }
        const updatedCourses = await Courses.findById(id);
        res.status(200).json(updatedCourses);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// delete a course

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Courses.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: `cannot find any course with ID ${id}` })
        }
        res.status(200).json(course);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export default router;