// @flow
import { difference } from 'lodash'
import { delay } from 'redux-saga'
import { put, select, call, takeEvery } from 'redux-saga/effects'
import { addTable } from 'containers/ColumnManager/actions'
import { getMyId } from 'containers/LoginModal/selectors'
import * as Actions from './constants'
import * as actions from './actions'
import type { ColumnId } from './reducer'
import { makeSelectColumn, makeSelectIds } from './selectors'
import * as selectors from './selectors'
import { addNotifyWithIllust } from '../Notify/actions'
import { FOLLOW_SUCCESS } from '../FollowButton/constants'
import * as fetchColumn from '../Column/sagas'

type Action = { id: ColumnId }

export function* addFollowColumn({ id }: Action): Generator<*, void, *> {
  const ids: Array<?ColumnId> = yield select(makeSelectIds())
  if (ids.every(v => v !== id)) {
    yield put(actions.addColumnSuccess(id))
  }

  yield put(addTable(`follow-${id}`, { columnId: id, type: 'FOLLOW' }))
}

const getEndpoint = (userId, restrict) =>
  `/v2/illust/follow?user_id=${userId}&restrict=${restrict}`

function* fetchFollow({ id }: Action): Generator<*, void, *> {
  try {
    const { ids, nextUrl } = yield select(makeSelectColumn(), { id })
    const endpoint = nextUrl ? nextUrl : getEndpoint(yield select(getMyId), id)
    yield call(fetchColumn.fetchColumn, endpoint, id, actions, ids)
  } catch (err) {
    yield put(actions.fetchFailre(id, err))
  }
}

function* fetchNew({ id }: Action): Generator<*, void, *> {
  const { ids } = yield select(selectors.makeSelectColumn(), { id })
  const endpoint = getEndpoint(yield select(getMyId), id)
  yield call(fetchColumn.fetchNew, { endpoint, id, ids, order: true }, actions)
}

// TODO キャンセル
function* fetchNewWatch(action: Action) {
  try {
    while (true) {
      const { interval } = yield select(selectors.makeSelectColumn(), action)
      // 増加したイラストをチェック
      const { ids } = yield select(makeSelectColumn(), action)
      yield call(fetchNew, action)
      const { ids: nextIds } = yield select(makeSelectColumn(), action)

      if (ids.length > 0) {
        const diffIllusts = difference(nextIds, ids)
        for (const id of diffIllusts) {
          yield put(addNotifyWithIllust('新着イラスト', id))
        }
      }

      yield call(delay, interval)
    }
  } catch (err) {
    // TODO エラーハンドリング
    console.log(err)
  }
}

export default function* root(): Generator<*, void, void> {
  yield takeEvery(Actions.ADD_COLUMN, addFollowColumn)
  yield takeEvery([Actions.FETCH, Actions.FETCH_NEXT], fetchFollow)

  yield takeEvery(Actions.ADD_COLUMN_SUCCESS, fetchNewWatch)
  yield takeEvery(FOLLOW_SUCCESS, function*({ restrict }) {
    const ids: Array<?ColumnId> = yield select(makeSelectIds())
    if (ids.some(v => v === restrict)) {
      yield call(fetchFollow, { id: restrict })
    }
  })
}
