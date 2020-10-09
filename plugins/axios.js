/* eslint-disable no-console */
export default function ({ $axios, redirect }) {
  $axios.setBaseURL(process.env.API_BASE_URL)

  $axios.onResponse((response) => {
    if (response && response.status >= 400) {
      console.log('Unsuccessful response (' + response.status + '):')
      console.log(response)
    }
  })
}
