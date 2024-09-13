<template>
	<div id="teamCardList">
		<van-card
			v-for="team in props.teamList"
		>
			<!-- 卡片 左侧图像区域 -->
			<template #thumb>
				<van-image
					class="img-box"
					:src="teamCover"
					loading
				>
				</van-image>
			</template>

			<!-- 卡片 标题区域 -->
			<template #title>
				<h1 class="title-box">{{ team.name }}</h1>
			</template>

			<!-- 卡片 文字描述区域 -->
			<template #desc>
				<p class="desc-box">{{ team.description }}</p>
			</template>

			<!-- 卡片 tag 区域 -->
			<template #tags>
				<van-tag
					class="tag-box"
					:type="team.status === 0 ? 'success' : 'warning'"
					size="small"
					plain
				>
					{{ teamStatusEnum[team.status] }}
				</van-tag>
			</template>

			<template #bottom>
				<p class="desc-box desc-box--margin">{{ `小组人数: ${team.hasJoinNum}/${team.maxNum}` }}</p>
				<p class="desc-box desc-box--margin">{{ `过期时间: ${timeFormat(team.expireTime.toString())}` }}</p>
				<p class="desc-box desc-box--margin">{{ "创建时间: " + timeFormat(team.createTime.toString()) }}</p>
			</template>

			<template #footer>
				<div id="card-footer">
					<van-button
						v-if="team.userId !== currentUser?.id && !team.hasJoin"
						@click="preJoinTeam(team)"
						size="small"
						type="primary"
					>
						加入小组
					</van-button>
					<van-button
						v-if="team.userId === currentUser?.id"
						@click="doUpdateTeam(team.id)"
						size="small"
						type="success"
					>
						更新小组
					</van-button>
					<!-- 仅加入小组可见 -->
					<van-button
						v-if="team.userId !== currentUser?.id && team.hasJoin"
						@click="doQuitTeam(team.id)"
						size="small"
						type="warning"
					>
						退出小组
					</van-button>
					<van-button
						v-if="team.userId === currentUser?.id"
						@click="doDeleteTeam(team.id)"
						size="small"
						type="danger"
					>
						解散小组
					</van-button>
				</div>
			</template>
		</van-card>

		<van-dialog
			v-model:show="showPasswordDialog"
			@confirm="doJoinTeam"
			@cancel="doJoinCancel"
			title="请输入密码"
			show-cancel-button
		>
			<van-field v-model="password" placeholder="请输入密码" />
		</van-dialog>
	</div>
</template>

<script setup lang="ts">
	import { TeamType } from "../models/team"
	import { teamStatusEnum } from "../constants/team"
	import teamCover from "../assets/default-team-cover-01.png"
	import myAxios from "../plugins/myAxios"
	import { Toast } from "vant"
	import { onMounted, ref } from "vue"
	import { getCurrentUser } from "../services/user"
	import { useRouter } from "vue-router"
	import { timeFormat } from "../composables"

	interface TeamCardListProps {
		teamList: TeamType[];
	}

	/**
	 * 父组件传递的属性
	 */
	const props = withDefaults(defineProps<TeamCardListProps>(), {
		// @ts-ignore
		teamList: [] as TeamType[],
	})

	/**
	 * 父组件监听的事件
	 */
	const emits = defineEmits(["teamChange"])

	const router = useRouter()

	const showPasswordDialog = ref(false)
	const password = ref("")
	const joinTeamId = ref(0)

	const currentUser = ref()

	/**
	 * 获取初始状态
	 */
	onMounted(async () => {
		currentUser.value = await getCurrentUser()
	})

	const preJoinTeam = (team: TeamType) => {
		joinTeamId.value = team.id
		if (team.status === 0) {
			doJoinTeam()
		} else {
			showPasswordDialog.value = true
		}
	}

	const doJoinCancel = () => {
		joinTeamId.value = 0
		password.value = ""
	}

	/**
	 * 加入小组
	 */
	const doJoinTeam = async () => {
		if (!joinTeamId.value) {
			return
		}
		const res = await myAxios.post("/team/join", {
			teamId: joinTeamId.value,
			password: password.value,
		})
		if (res?.code === 0) {
			Toast("已加入")
			// console.log(props.teamPageStatus)
			emits("teamChange", true)
			doJoinCancel()
		} else {
			Toast.fail("加入失败" + (res.description ? `，${res.description}` : ""))
		}
	}

	/**
	 * 跳转至更新小组页
	 * @param id
	 */
	const doUpdateTeam = (id: number) => {
		router.push({
			path: "/team/update",
			query: {
				id,
			},
		})
	}

	/**
	 * 退出小组
	 * @param id
	 */
	const doQuitTeam = async (id: number) => {
		const res = await myAxios.post("/team/quit", {
			teamId: id,
		})
		if (res?.code === 0) {
			Toast("已退出")
			emits("teamChange", true)
		} else {
			Toast.fail("退出失败" + (res.description ? `，${res.description}` : ""))
		}
	}

	/**
	 * 解散小组
	 * @param id
	 */
	const doDeleteTeam = async (id: number) => {
		const res = await myAxios.post("/team/delete", {
			id,
		})
		if (res?.code === 0) {
			Toast("已解散")
			emits("teamChange", true)
		} else {
			Toast.fail("解散失败" + (res.description ? `，${res.description}` : ""))
		}
	}
</script>

<style scoped>
	#teamCardList {
		font-family: sans-serif;
	}

	#teamCardList :deep(.van-image__img) {
		height: 128px;
		object-fit: unset;
	}

	#teamCardList .img-box :deep(.van-image__img) {
		margin-top: 24px;
		width: 95%;
		height: auto;
		border-radius: 20px;
	}

	.title-box {
		margin-top: -2px;
		color: gray;
		font-weight: 600;
		font-size: 14px;
	}

	.desc-box {
		margin-top: -2px;
		margin-bottom: -2px;
		color: gray;
	}

	.tag-box {
		margin: 8px 8px 8px 0;
		padding: 0 4px;
		font-size: 12px;
		font-weight: 500;
	}

	#teamCardList #card-footer {
		margin-top: 12px;
	}

	.desc-box--margin {
		margin-bottom: 2px;
	}
</style>
