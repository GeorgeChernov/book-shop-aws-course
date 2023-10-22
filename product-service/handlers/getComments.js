'use strict';

module.exports.getComments = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: '1',
          title: 'The book is ok'
        }, 
        {
          id: '2',
          title: 'The book sucks'
        }
      ]
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
