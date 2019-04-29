import { shallowMount } from "@vue/test-utils";
import ListItem from "@/components/ListItem.vue";

const factory = (propsData = {}) => {
  return shallowMount(ListItem, {
    propsData: { ...propsData }
  });
};

describe("ListItem.vue", () => {
  it("should render the title", () => {
    const title = "Super Title";
    const wrapper = factory({ title });
    expect(wrapper.text()).toMatch(title);
  });
});
