/* animeControllers.js
 * this file contain all controllers for handling anime requests
 */

exports.getAllAnimes = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
};
