
import axios from 'axios';

export function fetchNotifications(user: string, size: number) {
    const apiUrl = 'https://backend-kovan.epns.io/apis/feeds/get_feeds';

    const body = {
      "user": user,
      "page": 1,
      "pageSize": size || 50,
      "op": "read"
    };

    return axios.post(apiUrl, body)
      .then((response) => response.data)
      .catch((err) => {
        console.error(`[EPNS-SDK] - API: `, err);
      });
}

