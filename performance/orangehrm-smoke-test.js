import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 5,

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<5000'],
    checks: ['rate==1.0'],
  },
};

const baseUrl =
  __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export default function () {
  const response = http.get(
    `${baseUrl}/web/index.php/auth/login`,
    {
      tags: {
        name: 'OrangeHRM Login Page',
      },
    },
  );

  check(response, {
    'login page returns status 200': (res) => res.status === 200,
    'response contains OrangeHRM': (res) =>
      res.body.includes('OrangeHRM'),
  });

  sleep(1);
}