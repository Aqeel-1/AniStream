/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const exclude = ['sort', 'page', 'limit', 'fields'];
    exclude.forEach((element) => {
      delete queryObj[element];
    });

    if (queryObj.animeTags) {
      queryObj.animeTags = { $in: queryObj.animeTags.split(',') }; // Split tags and use $in operator
    }

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(lte|lt|gte|gt)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(defaultSorting, descending = false) {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      const sortFelde = `${descending ? '-' : ''}${defaultSorting}`;
      this.query = this.query.sort(sortFelde);
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
