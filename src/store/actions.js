import types from './mutation-type'

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
}

export const randomPlay = ({commit, state}, {songs}) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUENCE_LIST, songs)
  let _songs = songs.slice()
  _songs.sort(() => Math.random() - 0.5)
  console.log(_songs)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYLIST, _songs)
  commit(types.SET_PLAY_MODE, 2)
}
