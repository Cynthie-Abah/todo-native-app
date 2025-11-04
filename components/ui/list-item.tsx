import { truncateText } from "@/app/utils";
import { Id } from "@/convex/_generated/dataModel";
import { useDeleteTodo } from "@/hooks/use-delete-todo";
import { useUpdateTodo } from "@/hooks/use-update-todo";
import { LinearGradient } from "expo-linear-gradient";
import { Check, X } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, Swipeable } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// todo item props
type todo = {
    _id: Id<string>,
    title: string,
    completed: boolean
    onDragEnd: (from: number, to: number) => void;    
}

const ITEM_HEIGHT = 70;

export function ListItem({
    todo, 
    drag,
    darkMode }: {
        isActive: boolean, 
        drag: ()=> void, 
        todo: todo,
        darkMode: boolean 
    }) {
        
  const {updateTodo} = useUpdateTodo();
    const { deleteOneTodo, isLoading }  = useDeleteTodo();

    // ANIMATION VARIABLES
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const popupAlpha = useSharedValue(0);

// ANIMATION STYLE
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .onStart((_e) => {
      popupAlpha.value = withTiming(0);
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

// UPDATE TODO 
  const toggleTask = (_id: Id<string>, completed: boolean) => {
    updateTodo({ _id, completed: !completed})
  };
// DELETE TODO
    const deleteTodo = (_id: Id<string>) => {
    deleteOneTodo({ _id})
  };
// more styles
  const textColor = darkMode ? "#C8CBE7" : "#494C6B";
  const borderColor = darkMode ? "#393A4B" : "#E3E4F1";

// swipe to delete button
    const renderRightActions = () => (
    <Pressable
      onPress={() => deleteTodo(todo._id)}
      style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 80 }}
    >
      <Text style={{ color: 'white' }}>Delete</Text>
    </Pressable>
  );

  return (
    <Animated.View style={[animatedStyles, {height: ITEM_HEIGHT}]}>
      <GestureDetector gesture={dragGesture}>

    <Swipeable renderRightActions={renderRightActions}>
    <Pressable
        onLongPress={drag}
        onPress={() => toggleTask(todo._id, todo.completed)}
        style={[
          styles.todoItem,
          {
          borderBottomColor: borderColor,
        },
        todo.completed && { opacity: 0.6 },
        ]}
        accessible
        accessibilityLabel={`${todo.title}, ${todo.completed ? 'completed' : 'not completed'}`}
      >
        {todo.completed ? (
        <LinearGradient
          colors={["#55DDFF", "#C058F3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.checkboxGradient}
        >
            <Check size={15} strokeWidth={3} color={'white'} />
        </LinearGradient>
      ) : (
        <View style={[styles.checkbox, { borderColor: borderColor }]} />
      )}
      <Animated.View style={[{width: '95%', flexDirection: 'row', justifyContent: 'space-between'}]}>
        <Text
          style={[
            styles.todoText,
            {color: textColor},
            todo.completed && {
              textDecorationLine: "line-through",
              color: darkMode ? "#4D5067" : "#D1D2DA",
            },
          ]}
        >
          {truncateText(todo.title, 30)}
        </Text>

        <Pressable disabled={isLoading} onPress={()=> deleteTodo(todo._id)}>
          <X color={'#494C6B'} />
        </Pressable>
      </Animated.View>

      </Pressable>
    </Swipeable>

    </GestureDetector>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 23,
    borderBottomWidth: 1,
    fontFamily: 'JosefinSans_500Medium'
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    marginRight: 10,
  },
  checkboxGradient: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  todoText: {
    fontSize: 16,
    fontFamily: 'JosefinSans_500Medium'
  },
});