class Listener {
  constructor(playistsService, mailSender) {
    this._playistsService = playistsService
    this._mailSender = mailSender

    this.eventListener = this.eventListener.bind(this)
  }

  async eventListener(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString())
      const playlists = await this._playistsService.getPlaylists(playlistId)
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlists))

      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = Listener
