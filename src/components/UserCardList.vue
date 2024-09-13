<template>
	<div id="userCardList">
		<van-skeleton
			v-for="user in props.userList"
			:row="2"
			:loading="props.loading"
			title
			avatar
			avatar-size="50px"
		>
			<van-card :desc="user.profile" :title="user.username">
				<!-- 卡片 左侧图像区域 -->
				<template #thumb>
					<van-image
						:src="user.avatarUrl"
						height="100%"
						fill="cover"
						round
					>
					</van-image>
				</template>

				<!-- 卡片 标签显示区域 -->
				<template #tags>
					<van-tag
						class="tag-box"
						v-for="tag in user.tags"
						type="danger"
						plain
						round
					>
						{{ tag }}
					</van-tag>
				</template>

				<!-- 卡片 右下角的按钮 -->
				<template #footer>
					<van-button
						class="right-bottom-button"
						size="small"
						plain
					>
						联系我
					</van-button>
				</template>
			</van-card>
		</van-skeleton>
	</div>
</template>

<script setup lang="ts">
	import { UserType } from "../models/user"

	interface UserCardListProps {
		loading: boolean;
		userList: UserType[];
	}

	const props = withDefaults(defineProps<UserCardListProps>(), {
		loading: true,
		// @ts-ignore
		userList: [] as UserType[],
	})
</script>

<style scoped>
	#userCardList {
		font-family: sans-serif;
	}

	#userCardList .right-bottom-button {
		padding: 0 0.7rem;
		font-size: 0.8rem;
		box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
	}

	#userCardList .tag-box {
		margin: 8px 8px 8px 0;
	}
</style>
