<!--
 * @Author: yxx
 * @Date: 2023-08-29 09:12:52
 * @LastEditTime: 2023-09-02 02:55:15
 * @LastEditors: yxx
 * @Description:
 * @FilePath: \club-management-web\README.md
-->
<p align="center">
 <img src="https://img.shields.io/badge/Pig-3.7-success.svg" alt="Build Status">
 <img src="https://img.shields.io/badge/Spring%20Cloud-2021-blue.svg" alt="Coverage Status">
 <img src="https://img.shields.io/badge/Spring%20Boot-2.7-blue.svg" alt="Downloads">
 <img src="https://img.shields.io/badge/Vue-3.2-blue.svg" alt="Downloads">
 <img src="https://img.shields.io/github/license/pig-mesh/pig"/>
</p>

## 分支说明

- master: java8 + springboot 2.7 + springcloud 2021
- jdk17: java17 + springboot 3.1 + springcloud 2022

## 系统说明

- 基于 Spring Cloud 、Spring Boot、 OAuth2 的 RBAC **权限管理系统**
- 基于数据驱动视图的理念封装 element-plus，即使没有 vue 的使用经验也能快速上手
- 提供对常见容器化支持 Docker、Kubernetes、Rancher2 支持
- 提供 lambda 、stream api 、webflux 的生产实践

## 快速开始

### 核心依赖

| 依赖                        | 版本           |
| --------------------------- | -------------- |
| Spring Boot                 | 3.1.1          |
| Spring Cloud                | 2022.0.3       |
| Spring Cloud Alibaba        | 2022.0.0.0-RC2 |
| Spring Authorization Server | 1.1.1          |
| Mybatis Plus                | 3.5.3.1        |
| hutool                      | 5.8.20         |

### 模块说明

```lua

pig
├── pig-auth -- 授权服务提供[3000]
└── pig-common -- 系统公共模块
     ├── pig-common-bom -- 全局依赖管理控制
     ├── pig-common-core -- 公共工具类核心包
     ├── pig-common-datasource -- 动态数据源包
     ├── pig-common-job -- xxl-job 封装
     ├── pig-common-log -- 日志服务
     ├── pig-common-oss -- 文件上传工具类
     ├── pig-common-mybatis -- mybatis 扩展封装
     ├── pig-common-seata -- 分布式事务
     ├── pig-common-security -- 安全工具类
     ├── pig-common-swagger -- 接口文档
     ├── pig-common-feign -- feign 扩展封装
     └── pig-common-xss -- xss 安全封装
├── pig-register -- Nacos Server[8848]
├── pig-gateway -- Spring Cloud Gateway网关[9999]
└── pig-upms -- 通用用户权限管理模块
     └── pig-upms-api -- 通用用户权限管理系统公共api模块
     └── pig-upms-biz -- 通用用户权限管理系统业务处理模块[4000]
└── pig-visual
     └── pig-monitor -- 服务监控 [5001]
     ├── pig-codegen -- 图形化代码生成 [5002]
     └── pig-quartz -- 定时任务管理台 [5007]
```
