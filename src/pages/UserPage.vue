<template>
	<template v-if='user'>
		<van-cell :value='user?.username' title='当前用户' />
		<van-cell title='修改信息' is-link to='/user/update' />
		<van-cell title='已创建的小组' is-link to='/user/team/create' />
		<van-cell title='已加入的小组' is-link to='/user/team/join' />
		<van-cell @click='handleLogot' title='退出登录' is-link />
	</template>
</template>

<script setup lang='ts'>
	import { useRouter } from 'vue-router'
	import { onMounted, ref } from 'vue'
	import { getCurrentUser } from '../services/user'
	import { Dialog, Toast } from 'vant'
	import myAxios from '../plugins/myAxios'

	const router = useRouter()

	const user = ref()
	onMounted(async () => {
		// 获取当前登录用户
		user.value = await getCurrentUser()
	})

	const handleLogot = () => {
		Dialog.confirm({
			title: '退出登录',
			message:
				'',
		})
			.then(async () => {
				const res = await myAxios.post('/user/logout')
				if (res?.code === 0) {
					Toast('已退出')
					router.push({
						path: '/',
						replace: true
					})
				}
			})
			.catch(() => {
			})
	}
</script>

<style scoped>

</style>
