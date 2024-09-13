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
					placeholder="请输入小组描述"
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
						@confirm="handelConfirm"
						@cancel="showPicker = false"
						type="datetime"
						title="请选择过期时间"
						:min-date="minDate"
					/>
				</van-popup>

				<van-field name="radio" label="小组状态">
					<template #input>
						<van-radio-group v-model="radioChecked" direction="horizontal">
							<van-radio name="0">公开</van-radio>
							<van-radio name="2">加密</van-radio>
						</van-radio-group>
					</template>
				</van-field>

				<van-field
					v-if="addTeamData.status === 2"
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
	import { useRoute, useRouter } from "vue-router"
	import { onMounted, ref, watch } from "vue"
	import myAxios from "../plugins/myAxios"
	import { Toast } from "vant"
	import { timeFormat } from "../composables"

	const router = useRouter()
	const route = useRoute()

	const id = route.query.id
	// 日期选择器的显示隐藏开关
	const showPicker = ref(false)
	// 日期选择器的最小显示时间
	const minDate = new Date()
	// 需要用户填写的表单数据
	const addTeamData = ref({})
	// 日期的格式化显示
	const formatExpireTime = ref("点击选择过期时间")
	// 队伍状态的标识
	const radioChecked = ref("0")

	/**
	 * 获取需要修改的队伍的原始信息
	 */
	onMounted(async () => {
			if (id <= 0) {
				Toast.fail("加载小组失败")
				return
			}
			const res = await myAxios.get("/team/get", {
				params: {
					id,
				},
			})
			if (res?.code === 0) {
				addTeamData.value = res.data
				formatExpireTime.value = timeFormat(addTeamData.value?.expireTime)
				radioChecked.value = addTeamData.value?.status.toString()
			} else {
				Toast.fail("加载小组失败，请刷新重试")
			}
		},
	)

	/**
	 * 提交 修改队伍请求
	 */
	const onSubmit = async () => {
		const postData = {
			...addTeamData.value,
			status: addTeamData.value?.status,
		}
		// todo 前端参数校验
		const res = await myAxios.post("/team/update", postData)
		if (res?.code === 0 && res.data) {
			Toast("更新成功")
			router.push({
				path: "/team",
				replace: true,
			})
		} else {
			Toast("更新失败")
		}
	}

	/**
	 * 日期选择器弹框的确认按钮处理
	 */
	const handelConfirm = () => {
		showPicker.value = false
		formatExpireTime.value = timeFormat(addTeamData.value.expireTime)
	}

	/**
	 * 监听 队伍状态标识
	 */
	watch(radioChecked,(newValue, oldValue) => {
		addTeamData.value.status = Number(newValue)
	})
</script>

<style scoped>
</style>
