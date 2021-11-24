import * as React from "react";
import { view } from "@risingstack/react-easy-state";
import { RecentType } from "../../types/Recent";
import DiscoverCheckIn from "./CheckIn";
import DiscoverPost from "./Post";
import DiscoverReview from "./Review";
import DiscoverUser from "./User";
import { PostType } from "../../types/Post";
import { ReviewType } from "../../types/Review";
import { CheckInType } from "../../types/CheckIn";
import restaurantsStore from "../../utils/restaurantData";
import usersStore from "../../utils/userData";
import { useAuth } from "../../utils/auth";
import { BasicUserType, UserType } from "../../types/User";

type PropTypes = {
  item?: RecentType;
  user?: UserType | BasicUserType;
};

const DiscoverItem: React.FC<PropTypes> = ({ item, user: initialUser }) => {
  const { type, data } = item || {};
  const { user: userId, restaurant: restaurantId } = data || {};
  const { user: authedUser } = useAuth();
  const user = initialUser || (userId != null ? usersStore.get(userId) : null);
  const restaurant =
    restaurantId != null ? restaurantsStore.get(restaurantId) : null;

  const follows =
    authedUser._id === user._id ||
    usersStore?.following?.has(userId || restaurantId) ||
    false;
  const saved =
    data != null ? usersStore?.saved?.has(data?._id) || false : false;

  if (type === "Post") {
    return (
      <DiscoverPost
        data={data as PostType}
        user={user}
        restaurant={restaurant}
        follows={follows}
        saved={saved}
      />
    );
  }
  if (type === "Review") {
    return (
      <DiscoverReview
        data={data as ReviewType}
        user={user}
        restaurant={restaurant}
        follows={follows}
        saved={saved}
      />
    );
  }
  if (type === "CheckIn") {
    return (
      <DiscoverCheckIn
        data={data as CheckInType}
        user={user}
        restaurant={restaurant}
        saved={saved}
      />
    );
  }
  if (type === "User" || user != null) {
    return <DiscoverUser data={user as UserType} follows={follows} />;
  }
  return null;
};

export default view(DiscoverItem);
