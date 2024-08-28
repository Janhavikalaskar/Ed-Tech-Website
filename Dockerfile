FROM node:20
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
EXPOSE 3000
ENV REACT_APP_BASE_URL = BACKEND_URL/api/v1
ENV RAZORPAY_KEY = razor_pay_key
CMD ["npm","start"]