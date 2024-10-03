const fs = require('fs')
module.exports = {
  files: ['key'],

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    key: {
      example: '===',
      required: true,
    },
  },

  exits: {
    success: {
      responseType: ``,
    },
    badRequest: {
      responseType: 'badRequest',
    },
    serverError: {
      responseType: 'serverError',
    },
  },

  fn: async function ({id, key}, exits) {
    try {
      let fileName = ''
      key.upload(
        {
          saveAs: (file, cb) => {
            fileName = file.filename
            cb(null, `../../orange_data_keys/${id}/${fileName}`)
          }
        },
        (err, uploadedFiles) => {
          if (uploadedFiles.length === 0 || err) {
            sails.log.error(err || 'empty upload files');
            return exits.badRequest({
              message: err ? err.message : 'empty upload files',
            });
          }
        })
      await Partner.updateOne({id}, {orangeCredentials: `../../orange_data_keys/${id}`})
      return exits.success();
    } catch (err) {
      sails.log.error(err)
      throw {serverError: {message: err.message}}
    }
  }
}
