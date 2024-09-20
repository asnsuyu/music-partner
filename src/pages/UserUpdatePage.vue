<template>
	<template v-if='user'>
		<van-cell
			:value='user.username'
			@click="doEdit('username', '昵称', user.username)"
			title='昵称'
			is-link to='/user/edit'
		/>

		<van-cell :value='user.userAccount' title='账号' />

		<van-cell title='头像'>
			<van-image
				:src='user?.avatarUrl'
				width='50px'
				round
			>
			</van-image>
		</van-cell>

		<van-cell
			:value="user.gender === 0 ? '男' : '女'"
			@click="doEdit('gender', '性别', user.gender === 0 ? '男' : '女')"
			title='性别'
			is-link to='/user/edit'
		/>

		<van-cell
			:value='user.phone'
			@click="doEdit('phone', '电话', user.phone)"
			title='电话'
			is-link to='/user/edit'
		/>

		<van-cell
			:value='user.email'
			@click="doEdit('email', '邮箱', user.email)"
			title='邮箱'
			is-link to='/user/edit'
		/>

		<van-cell :value='formatTimeText' title='注册时间' />
	</template>
</template>

<script setup lang='ts'>
	import { useRouter } from 'vue-router'
	import { onMounted, ref } from 'vue'
	import { getCurrentUser } from '../services/user'
	import { formatTime } from '../composables'
	import { UserType } from '../models/user'
	import { genderEnum } from "../constants"

	const user = ref<UserType>()
	const formatTimeText = ref<string>()
	onMounted(async () => {
		user.value = await getCurrentUser()
		formatTimeText.value = formatTime(user.value?.createTime.toString())
	})

	const router = useRouter()
	const doEdit = (editKey: string, editName: string, currentValue: string) => {
		router.push({
			path: '/user/edit',
			query: {
				editKey,
				editName,
				currentValue,
			},
		})
	}
</script>

<style scoped>

</style>