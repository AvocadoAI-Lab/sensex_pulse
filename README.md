# Sensex Pulse

這是一個基於 Next.js 開發的網頁應用程式。

## 使用 Docker Compose 運行服務

### 步驟 1: 建立 docker-compose.yml

在專案根目錄建立 `docker-compose.yml` 檔案，內容如下：

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "29005:29005"
    environment:
      - PORT=29005
```

### 步驟 2: 運行服務

在專案根目錄執行以下指令：

```bash
docker-compose up
```

如果要在背景執行，可以加上 `-d` 參數：

```bash
docker-compose up -d
```

### 步驟 3: 訪問服務

服務啟動後，可以通過以下網址訪問：

```
http://localhost:29005
```

### 停止服務

要停止服務，執行：

```bash
docker-compose down
```

## 其他常用指令

- 重新建構映像：
  ```bash
  docker-compose build
  ```

- 查看服務日誌：
  ```bash
  docker-compose logs
  ```

- 查看服務狀態：
  ```bash
  docker-compose ps
