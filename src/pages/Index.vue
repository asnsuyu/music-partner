<template>
	<div id="indexPage">
		<van-cell class="header-cell">
			<template #title>
				开启知音模式
			</template>
			<template #right-icon>
				<van-switch v-model="isMatchMode" size="24" />
			</template>
		</van-cell>
		<user-card-list :user-list="userList" :loading="loading" />
		<van-empty
			class="loading-box"
			v-if="!currentUser || userList.length < 1"
			:image="loadingAnime"
			image-size="80%"
		/>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref, watch, watchEffect } from "vue"
	import myAxios from "../plugins/myAxios"
	import { Toast } from "vant"
	import UserCardList from "../components/UserCardList.vue"
	import { UserType } from "../models/user"
	import loadingAnime from "../assets/loading-anime-03.gif"
	import { getCurrentUser } from "../services/user"

	const currentUser = ref()

	const isMatchMode = ref<boolean>(false)
	const userList = ref([])
	const loading = ref(true)

	// 请求数据
	const loadData = async () => {
		// 获取用户登录态
		currentUser.value = await getCurrentUser()

		let userListData
		loading.value = true

		// 首页匹配模式，根据标签匹配用户
		if (isMatchMode.value) {
			const num = 10
			userListData = await myAxios.get("/user/match", {
				params: {
					num,
				},
			})
				.then(function(response) {
					console.log("/user/match succeed", response)
					return response?.data
				})
				.catch(function(error) {
					console.error("/user/match error", error)
					Toast.fail("请求失败")
				})
		} else {
			// 普通模式，直接分页查询用户
			userListData = await myAxios.get("/user/recommend", {
				params: {
					pageSize: 10,
					pageNum: 1,
				},
			})
				.then(function(response) {
					console.log("/user/recommend succeed", response)
					return response?.data?.records
				})
				.catch(function(error) {
					console.error("/user/recommend error", error)
					Toast.fail("请求失败")
				})
		}
		if (userListData) {
			userListData.forEach((user: UserType) => {
				if (user.tags) {
					user.tags = JSON.parse(user.tags)
				}
			})
			userList.value = userListData
		}
		loading.value = false
	}

	onMounted(() => {
		loadData()
	})

	watch(isMatchMode, () => {
		loadData()
	})
</script>

<style scoped>
	#indexPage {
		font-family: sans-serif;
	}

	.header-cell :deep(.van-cell__title) {
		padding-left: 1rem;
	}

	.loading-box {
		margin-top: 100px;
	}
</style>
