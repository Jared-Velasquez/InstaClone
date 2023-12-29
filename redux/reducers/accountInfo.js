// Firebase Imports
import { auth } from '../../firebase/firebase';

// Utility Imports
import { queryAccountPosts } from '../../utilities/FeedLoader';

const accountData = async (state = null, action) => {
    switch(action.type) {
        case 'GET_INFO':
            console.log('Getting data!');
            const user = auth.currentUser;
            const data = await queryAccountPosts(user.email);

            console.log(data.userData);

            return data;
        default:
            return state;
    }
}

export default accountData;