<template>
	<div id="teamPage">
		<van-search v-model="searchText" placeholder="搜索小组" @search="onSearch" />

		<van-tabs v-model:active="active" @change="onTabChange">
			<van-tab title="公开" name="public" />
			<van-tab title="加密" name="private" />
		</van-tabs>

		<div style="margin-bottom: 16px" />
		<team-card-list :teamList="teamList" @teamChange="handleTeamChange" />
		<van-button class="add-button" type="primary" icon="plus" @click="toAddTeam" />
		<van-empty v-if="teamList?.length < 1" description="数据为空" />
	</div>
</template>

<script setup lang="ts">
	import { useRouter } from "vue-router"
	import TeamCardList from "../components/TeamCardList.vue"
	import { onMounted, ref } from "vue"
	import myAxios from "../plugins/myAxios"
	import { Toast } from "vant"

	const router = useRouter()

	const active = ref("public")
	const searchText = ref("")
	/**
	 * 存放查询到的 所有小组
	 */
	const teamList = ref([])
	/**
	 * 当前小组页处于 公开 还是 加密 查看状态
	 */
	const teamPageStatus = ref(0)

	/**
	 * 切换查询状态
	 * @param name
	 */
	const onTabChange = (name: string) => {
		// 查公开
		if (name === "public") {
			listTeam(searchText.value, 0)
			teamPageStatus.value = 0
		} else {
			// 查加密
			listTeam(searchText.value, 2)
			teamPageStatus.value = 2
		}
	}

	// 跳转到创建小组页
	const toAddTeam = () => {
		router.push({
			path: "/team/add",
		})
	}


	/**
	 * 搜索小组
	 * @param val
	 * @param status
	 * @returns {Promise<void>}
	 */
	const listTeam = async (val = "", status = 0) => {
		const res = await myAxios.get("/team/list", {
			params: {
				searchText: val,
				pageNum: 1,
				status,
			},
		})
		if (res?.code === 0) {
			teamList.value = res.data
		} else {
			Toast.fail("加载小组失败，请刷新重试")
		}
	}

	// 页面加载时只触发一次
	onMounted(() => {
		listTeam()
	})

	const onSearch = (val: string) => {
		listTeam(val)
	}

	/**
	 * 监听子组件的小组操作，成功则需重新请求最新的小组列表
	 * @param flag
	 */
	const handleTeamChange = (flag: boolean) => {
		if (flag) {
			listTeam("", teamPageStatus.value)
		}
		return
	}
</script>

<style scoped>
	#teamPage .add-button {
		position: fixed;
		bottom: 70px;
		right: 12px;
		box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
	}
</style>
