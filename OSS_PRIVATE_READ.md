# 阿里云OSS私有读配置说明

## 问题背景
当阿里云OSS的Bucket设置为私有读（阻止公共读）时，直接使用域名访问图片和文件会返回403错误。需要使用签名URL来访问私有资源。

## 解决方案
本项目已支持OSS私有读模式，通过生成带签名的临时访问URL来访问私有资源。

## 配置方法

### 1. 修改OSS配置文件
编辑 `conf/oss.conf` 文件，设置 `IsPrivate` 参数：

```ini
# OSS是否为私有读（true表示私有读，需要使用签名URL；false表示公共读，直接使用域名访问）
IsPrivate=true
```

- `IsPrivate=true`: 启用私有读模式，所有图片和文件都会使用签名URL
- `IsPrivate=false`: 公共读模式，直接使用域名访问（默认）

### 2. 阿里云OSS Bucket配置
登录阿里云OSS控制台，设置Bucket为私有读：
1. 进入Bucket管理页面
2. 权限管理 -> 读写权限
3. 选择"私有"

### 3. 重启应用
修改配置后，重启应用使配置生效：
```bash
./itshujia restart
```

## 技术实现

### 签名URL有效期
- **图片资源**: 24小时（86400秒）
- **音视频资源**: 5小时（配置文件中的media_duration）

### 已适配的功能模块
1. ✅ 书籍封面图片
2. ✅ 文档内图片
3. ✅ 用户头像
4. ✅ 分类图标
5. ✅ Banner图片
6. ✅ 附件下载
7. ✅ 音视频文件
8. ✅ API接口返回

### 代码修改说明

#### 1. models/store/oss.go
新增 `GetSignURL` 方法，用于生成签名URL：
```go
func (o *Oss) GetSignURL(object string, expires int64) (signedURL string, err error)
```

#### 2. controllers/api/BaseController.go
修改 `completeLink` 方法，自动判断是否需要生成签名URL

#### 3. controllers/DocumentController.go
文档阅读页面的图片处理，添加签名URL支持

#### 4. controllers/StaticController.go
静态文件访问控制器，添加私有读支持

## 注意事项

1. **签名URL有过期时间**
   - 图片24小时后需要重新生成签名
   - 前端可能需要处理签名过期的情况

2. **性能影响**
   - 每次访问都需要生成签名，会有轻微性能开销
   - 建议在客户端做适当缓存

3. **兼容性**
   - 已兼容公共读和私有读两种模式
   - 切换模式只需修改配置文件，无需修改代码

4. **AccessKey安全**
   - 确保 `conf/oss.conf` 文件权限设置正确
   - 不要将包含AccessKey的配置文件提交到公开仓库

## 测试验证

### 1. 测试图片访问
访问书籍页面，检查图片是否正常显示

### 2. 查看图片URL
在浏览器开发者工具中查看图片URL，应该包含签名参数：
```
https://your-bucket.oss-cn-shanghai.aliyuncs.com/path/to/image.png?Expires=xxx&OSSAccessKeyId=xxx&Signature=xxx
```

### 3. 测试API接口
调用API接口，检查返回的图片URL是否包含签名

## 常见问题

### Q1: 图片显示403错误
A: 检查 `IsPrivate` 配置是否为 `true`，确认已重启应用

### Q2: 签名URL过期后图片无法显示
A: 刷新页面重新生成签名URL，或增加 `expires` 参数值

### Q3: 切换回公共读模式
A: 将 `IsPrivate` 设置为 `false`，并在OSS控制台将Bucket权限改为公共读

## 相关文件

- `conf/oss.conf` - OSS配置文件
- `models/store/oss.go` - OSS存储模型
- `controllers/api/BaseController.go` - API基础控制器
- `controllers/DocumentController.go` - 文档控制器
- `controllers/StaticController.go` - 静态文件控制器

