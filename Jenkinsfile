pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'JENKINS_NODE_COOKIE=dontKillMe node index.js &'
      }
    }
    stage('Deploy') {
      steps {
        sh 'mkdir -p /home/jorodriguez/meritoki/dailybread/'
        sh 'sudo rm -rf msg'
        sh 'sudo git clone -b dev https://github.com/meritoki/msg.git'
        sh 'cd msg'
        sh 'git branch -a'
        sh 'git status'
        sh 'docker stop msg-service || true && docker rm msg-service || true'
        sh 'docker rmi $(docker images |grep \'dailybread/msg-service\') || true'
        sh 'docker build -t dailybread/msg-service .'
        sh 'sudo docker run --network host -dlt --restart unless-stopped --name msg-service -p 3004:3004 dailybread/msg-service'
      }
    }
  }
  triggers {
    cron('H/15 * * * *')
  }
}