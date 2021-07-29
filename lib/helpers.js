const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });


function fillQueryTemplate(template, data) {
  const matches = Array.from(template.matchAll(/[\{](.*?)[\}]/gmu)); // eslint-disable-line no-useless-escape
  const matchesLength = matches.length;

  let query = template;
  for (let i = 0; i < matchesLength; i += 1) {
    const key = matches[i][1].trim();
    if (key in data) {
      query = query.replace(matches[i][0], data[key]);
    } else {
      console.error('Key', key, 'not found!');
    }
  }

  console.log('Filled template:', query);
  return query;
}


async function getresID(options) {

    try {
        const responseID = await request.post(options) 
        return responseID;
      } catch (err) {
        console.log(err)
        return err;
      }
}


module.exports = {
  fillQueryTemplate,
  getresID,
};
