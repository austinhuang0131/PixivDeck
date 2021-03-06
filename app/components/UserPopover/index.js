// @flow
import React from 'react'
import type { User } from 'types/user'
import type { Illust } from 'types/illust'
import FollowButton from 'containers/FollowButton'
import Avater from 'components/Avater'
import Profile from 'components/Profile'
import Wrap from './Wrap'
import ImageWrap from './ImageWrap'
import Top from './Top'
import TopRight from './TopRight'

export type Props = {
  onClick: () => void,
  illusts: Array<Illust>,
  user: User,
}

const UserPopover = ({ user, onClick, illusts }: Props) => {
  return (
    <Wrap>
      <Top>
        <TopRight>
          <Avater
            src={user.profileImageUrls.medium}
            onClick={onClick}
            size={48}
          />
          <Profile
            name={user.name}
            onClick={onClick}
            style={{ color: '#222' }}
          />
        </TopRight>
        <FollowButton user={user} />
      </Top>
      <ImageWrap>
        {illusts.length > 0 &&
          illusts.map(v => (
            <img
              key={v.id}
              src={v.imageUrls.squareMedium}
              width={150}
              height={150}
            />
          ))}
      </ImageWrap>
    </Wrap>
  )
}

export default UserPopover
