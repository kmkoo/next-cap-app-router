// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis("redis://127.0.0.1:6379"); // EC2 내부 Redis 사용

export default redis;
