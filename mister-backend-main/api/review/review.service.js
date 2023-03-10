const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
        const reviews = await collection.find(criteria).toArray()
        // var reviews = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             from: 'user',
        //             localField: 'byUserId',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             from: 'toys',
        //             localField: 'aboutToyId',
        //             foreignField: '_id',
        //             as: 'aboutToy'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutToy'
        //     }
        // ]).toArray()
        // reviews = reviews.map(review => {

        //     review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
        //     review.aboutToy = { _id: review.aboutToy._id, fullname: review.aboutToy.fullname }
        //     delete review.byUserId
        //     delete review.aboutToyId
        //     return review
        // })
        // console.log('query return', reviews)
        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(reviewId) }
        // if (!loggedinUser.isAdmin) 
        // criteria.byUserId = ObjectId(loggedinUser._id)
        console.log('criteria', criteria);
        const { deletedCount } = await collection.deleteOne(criteria)
        console.log('deletedCount', deletedCount);
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {

        // review = {
        //     txt,
        //     toy: {
        //         aboutToyId,
        //         name,
        //         price
        //     },
        //     user: {
        //         aboutUserId,
        //         nickname
        //     }
        // }

        const reviewToAdd = {
            content: review.txt,
            toy: {
                aboutToyId: ObjectId(review.toy.aboutToyId),
                name: review.toy.name,
                price: review.toy.price
            },
            user: {
                aboutUserId: ObjectId(review.user.aboutUserId),
                nickname: review.user.nickname,
            },

        }

        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = ObjectId(filterBy.byUserId)
    if (filterBy.aboutToyId) criteria.aboutToyId = ObjectId(filterBy.aboutToyId)
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


