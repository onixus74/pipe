// Copyright 2020 The PipeCD Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package rediscache

import (
	"time"

	redigo "github.com/gomodule/redigo/redis"

	"github.com/pipe-cd/pipe/pkg/cache"
	"github.com/pipe-cd/pipe/pkg/redis"
)

type RedisCache struct {
	redis redis.Redis
	ttl   uint
}

func NewCache(redis redis.Redis) *RedisCache {
	return &RedisCache{
		redis: redis,
	}
}

func NewTTLCache(redis redis.Redis, ttl time.Duration) *RedisCache {
	return &RedisCache{
		redis: redis,
		ttl:   uint(ttl.Seconds()),
	}
}

func (c *RedisCache) Get(k interface{}) (interface{}, error) {
	conn := c.redis.Get()
	defer conn.Close()
	reply, err := conn.Do("GET", k)
	if err != nil {
		if err == redigo.ErrNil {
			return nil, cache.ErrNotFound
		}
		return nil, err
	}
	if reply == nil {
		return nil, cache.ErrNotFound
	}
	if err, ok := reply.(redigo.Error); ok {
		return nil, err
	}
	return reply, nil
}

func (c *RedisCache) Put(k interface{}, v interface{}) error {
	conn := c.redis.Get()
	defer conn.Close()
	var err error
	if c.ttl == 0 {
		_, err = conn.Do("SET", k, v)
	} else {
		_, err = conn.Do("SETEX", k, c.ttl, v)
	}
	return err
}

func (c *RedisCache) Delete(k interface{}) error {
	conn := c.redis.Get()
	defer conn.Close()
	_, err := conn.Do("DEL", k)
	return err
}
