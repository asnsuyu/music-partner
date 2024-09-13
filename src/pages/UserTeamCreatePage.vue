<template>
	<div id="teamPage">
		<van-search v-model="searchText" placeholder="搜索小组" @search="onSearch" />
		<van-button
			class="create-button"
			@click="doJoinTeam"
			type="primary"
		>
			创建小组
		</van-button>
		<team-card-list :teamList="teamList" />
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

	/**
	 * 跳转到 加入小组页
	 */
	const doJoinTeam = () => {
		router.push({
			path: "/team/add",
		})
	}

	const searchText = ref("")
	const teamList = ref([])

	/**
	 * 搜索小组
	 * @param val
	 * @returns {Promise<void>}
	 */
	const listTeam = async (val = "") => {
		const res = await myAxios.get("/team/list/my/create", {
			params: {
				searchText: val,
				pageNum: 1,
			},
		})
		if (res?.code === 0) {
			teamList.value = res.data
		} else {
			Toast.fail("加载小组失败，请刷新重试")
		}
	}

	/**
	 * 加载 所有创建的小组
	 */
	onMounted(() => {
		listTeam()
	})

	const onSearch = (val) => {
		listTeam(val)
	}

</script>

<style scoped>
	#teamPage .create-button {
		margin: 12px 0 0 12px;
		border-radius: 4px;
	}
</style>
