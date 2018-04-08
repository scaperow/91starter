
FROM google/nodejs-runtime
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]