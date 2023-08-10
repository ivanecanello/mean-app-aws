const Comment = require('../models/Comment');
const commentController = require('./comment.controller');

jest.mock('../models/Comment', () => ({
    create: jest.fn(),
    findByFlightId: jest.fn(),
}));

describe('commentController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    describe('create', () => {
        it('should create a comment', () => {
            const commentData = { comment: 'New Comment' };
            req.body = commentData;
            Comment.create.mockImplementationOnce((data, callback) => {
                callback(null, commentData);
            });

            commentController.create(req, res, next);

            expect(Comment.create).toHaveBeenCalledWith(commentData, expect.any(Function));
        });
    });
    describe('findByFlightId', () => {
        it('should get comments by flightId', async () => {
            const flightId = 1;
            const expectedComments = [{ text: 'Comment 1' }, { text: 'Comment 2' }];
            const req = { params: { flightId } };
            const res = { send: jest.fn(), status: jest.fn() };

            Comment.find = jest.fn().mockResolvedValue(expectedComments);

            await commentController.findByFlightId(req, res);
            expect(Comment.find).toHaveBeenCalledWith({ flightId });
        });
    });
});
