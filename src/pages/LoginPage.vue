<template>
	<div id="loginPage">
		<van-form @submit="onSubmit">
			<van-cell-group inset>
				<van-field
					:modelValue="userAccount ?? 'test01'"
					@input="onAccountInput"
					name="userAccount"
					label="账号"
					placeholder="账号为 test + 数字，例如：test01"
					:rules="[{ required: true, message: '请填写用户名' }]"
				/>
				<van-field
					:modelValue="userPassword ?? '12345678'"
					@input="onPassswordInput"
					v-model="userPassword"
					type="password"
					name="userPassword"
					label="密码"
					placeholder="密码均为 12345678"
					:rules="[{ required: true, message: '请填写密码' }]"
				/>
			</van-cell-group>
			<div style="margin: 16px;">
				<van-button round block type="primary" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
	</div>
</template>

<script setup lang="ts">
	import { useRoute, useRouter } from "vue-router"
	import { ref } from "vue"
	import myAxios from "../plugins/myAxios"
	import { Toast } from "vant"

	const router = useRouter()
	const route = useRoute()

	const userAccount = ref<string | undefined>(undefined)
	const userPassword = ref<string | undefined>(undefined)

	const onSubmit = async () => {
		const res = await myAxios.post("/user/login", {
			userAccount: userAccount.value ?? "test01",
			userPassword: userPassword.value ?? "12345678",
		})
		if (res.code === 0 && res.data) {
			Toast("登录成功")
			// 跳转到之前的页面
			window.location.href = route.query?.redirect as string ?? "/"
		} else {
			Toast.fail("登录失败")
		}
	}

	const onAccountInput = (e: any) => {
		userAccount.value = e.target.value
		console.log("userAccount:", userAccount.value)
	}
	const onPassswordInput = (e: any) => {
		userPassword.value = e.target.value
		console.log("userPassword:", userPassword.value)
	}
</script>

<style scoped>
	#loginPage {
		font-family: sans-serif;
	}
</style>
