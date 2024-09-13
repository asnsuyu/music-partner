<template>
	<div id="teamAddPage">
		<van-form @submit="onSubmit">
			<van-cell-group inset>
				<van-field
					v-model="addTeamData.name"
					name="name"
					label="小组名字"
					placeholder="请输入小组的名字"
					:rules="[{ required: true, message: '请输入小组的名字' }]"
				/>

				<van-field
					v-model="addTeamData.description"
					rows="4"
					autosize
					label="小组描述"
					type="textarea"
					placeholder="请输入小组的描述"
				/>

				<van-field
					v-model:placeholder="formatExpireTime"
					@click="showPicker = true"
					label="有效期限"
					name="datetimePicker"
					is-link
					readonly
				/>

				<van-popup v-model:show="showPicker" position="bottom">
					<van-datetime-picker
						v-model="addTeamData.expireTime"
						:min-date="minDate"
						@confirm="handelConfirm"
						@cancel="showPicker = false"
						title="请选择过期时间"
						type="datetime"
					/>
				</van-popup>

				<van-field name="stepper" label="最大人数">
					<template #input>
						<van-stepper v-model="addTeamData.maxNum" max="10" min="3" />
					</template>
				</van-field>

				<van-field name="radio" label="小组状态">
					<template #input>
						<van-radio-group v-model="addTeamData.status" direction="horizontal">
							<van-radio name="0">公开</van-radio>
							<van-radio name="1">私有</van-radio>
							<van-radio name="2">加密</van-radio>
						</van-radio-group>
					</template>
				</van-field>

				<van-field
					v-if="Number(addTeamData.status) === 2"
					v-model="addTeamData.password"
					type="password"
					name="password"
					label="密码"
					placeholder="请输入小组密码"
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
	import { useRouter } from "vue-router"
	import { ref, watch } from "vue"
	import myAxios from "../plugins/myAxios"
	import { Toast } from "vant"
	import { timeFormat } from "../composables"

	const router = useRouter()

	// 展示日期选择器
	const showPicker = ref(false)

	const initFormData = {
		"name": "",
		"description": "",
		"expireTime": null,
		"maxNum": 3,
		"password": "",
		"status": 0,
	}

	const minDate = new Date()
	const formatExpireTime = ref("点击选择过期时间")

	// 需要用户填写的表单数据
	const addTeamData = ref({ ...initFormData })

	// 提交
	const onSubmit = async () => {
		const postData = {
			...addTeamData.value,
			status: Number(addTeamData.value.status),
		}
		// todo 前端参数校验
		const res = await myAxios.post("/team/add", postData)
		if (res?.code === 0 && res.data) {
			Toast("添加成功")
			await router.push({
				path: "/team",
				replace: true,
			})
		} else {
			Toast("添加失败")
		}
	}

	const handelConfirm = () => {
		showPicker.value = false
		formatExpireTime.value = timeFormat(addTeamData.value.expireTime ?? "")
	}
</script>

<style scoped>
	#teamPage {

	}
</style>
