pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    COMPOSE_FILE_NAME = 'docker-compose.jenkins.yml'
    BACKEND_HEALTH_URL = 'http://localhost:5000/api/health'
    FRONTEND_URL = 'http://localhost:5173'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Kod deposu alınıyor...'
        checkout scm
      }
    }

    stage('Show Tool Versions') {
      steps {
        sh 'docker --version'
        sh 'docker compose version'
      }
    }

    stage('Backend Install Check') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
      }
    }

    stage('Frontend Install And Build Check') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Docker Compose Build') {
      steps {
        echo 'Docker imajları oluşturuluyor...'
        sh 'docker compose -f ${COMPOSE_FILE_NAME} build'
      }
    }

    stage('Deploy With Docker Compose') {
      steps {
        echo 'Eski containerlar kapatılıyor...'
        sh 'docker compose -f ${COMPOSE_FILE_NAME} down --remove-orphans'

        echo 'Yeni containerlar ayağa kaldırılıyor...'
        sh 'docker compose -f ${COMPOSE_FILE_NAME} up -d'
      }
    }

    stage('Seed Admin') {
      steps {
        echo 'Admin seed çalıştırılıyor...'
        sh 'docker compose -f ${COMPOSE_FILE_NAME} exec -T backend npm run seed:admin'
      }
    }

    stage('Health Check') {
      steps {
        echo 'Backend health check bekleniyor...'
        sh '''
          for i in $(seq 1 20); do
            if curl -fsS ${BACKEND_HEALTH_URL}; then
              echo "Backend hazır"
              exit 0
            fi

            echo "Backend bekleniyor... deneme: $i"
            sleep 5
          done

          echo "Backend health check başarısız"
          docker compose -f ${COMPOSE_FILE_NAME} ps
          docker compose -f ${COMPOSE_FILE_NAME} logs backend
          exit 1
        '''

        echo 'Frontend kontrol ediliyor...'
        sh '''
          for i in $(seq 1 20); do
            if curl -fsS ${FRONTEND_URL}; then
              echo "Frontend hazır"
              exit 0
            fi

            echo "Frontend bekleniyor... deneme: $i"
            sleep 5
          done

          echo "Frontend health check başarısız"
          docker compose -f ${COMPOSE_FILE_NAME} ps
          docker compose -f ${COMPOSE_FILE_NAME} logs frontend
          exit 1
        '''
      }
    }

    stage('Show Running Containers') {
      steps {
        sh 'docker compose -f ${COMPOSE_FILE_NAME} ps'
      }
    }
  }

  post {
    success {
      echo 'Pipeline başarılı. E-Reçete Docker üzerinde çalışıyor.'
      echo 'Frontend: http://localhost:5173'
      echo 'Backend: http://localhost:5000/api/health'
      echo 'RabbitMQ: http://localhost:15672'
    }

    failure {
      echo 'Pipeline başarısız. Logları kontrol et.'
      sh 'docker compose -f ${COMPOSE_FILE_NAME} ps || true'
    }
  }
}