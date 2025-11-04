import CustomSpinner from '@/components/ui/customer-spinner';
import { ListItem } from '@/components/ui/list-item';
import { useCreateTodo } from '@/hooks/use-create-todo';
import { useDeleteTodo } from '@/hooks/use-delete-todo';
import useTodo from '@/hooks/use-todo';
import { todo } from '@/type';
import { JosefinSans_500Medium, JosefinSans_700Bold, useFonts } from '@expo-google-fonts/josefin-sans';
import { Feather } from "@expo/vector-icons";
import { Moon, Sun } from 'lucide-react-native';
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import DraggableFlatList, {
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
const bgImageLight = require('../assets/images/BitmapLight.png')
const bgImageDark = require('../assets/images/BitmapDark.png')

const screenHeight = Dimensions.get('window').height;

export default function App() {
    const colorScheme = useColorScheme();
    const [darkMode, setDarkMode] = useState(colorScheme === "dark");
    const [filter, setFilter] = useState("All");
    const [text, setText] = useState<string>("");

    // hooks
    const {todos, isLoading,} = useTodo(filter);
    const {handleCreateTodo, isloading} = useCreateTodo()
    const { deleteCompletedTodos, isLoading: isDeleting }  = useDeleteTodo();

// INIVIDUAL LIST ITEM
    const renderItem = useCallback(
        ({ item, drag, isActive }: RenderItemParams<any>) => (
        <ListItem 
        todo={item}
        drag={drag}
        isActive={isActive}
        darkMode={darkMode}
        />
        
        
        ),
        [darkMode]
    );

// FONT CHOICE 
    const [loaded] = useFonts({
    JosefinSans_500Medium, JosefinSans_700Bold,
    })
    if (!loaded) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
    }
    // CREATE NEW TASK
    const addTask = () => {
    if (!text.trim()) return;

    const newTodo = { 
        id: Date.now().toString(), 
        title: text.trim(), 
        completed: false 
    };

    handleCreateTodo(newTodo);
    setText("");
    };
    // CLEAR COMPLETED TASKS FXN
    const clearCompleted = () => {
        deleteCompletedTodos()
    };

// complementary styles
    const screenWidth = Dimensions.get("window").width;
    const isDesktop = screenWidth > 768;
    const backgroundColor = darkMode ? "#171823" : "#FAFAFA";
    const cardColor = darkMode ? "#25273D" : "#fff";
    const textColor = darkMode ? "#E3E4F1" : "#494C6B";

// ANIMATIONS
    const AnimatedDraggableFlatList = Animated.createAnimatedComponent(DraggableFlatList);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* LOADING SPINNER */}
        { (!loaded || isLoading || isloading || isDeleting) &&
            <CustomSpinner />
        }
        {/* BACKGROUND IMAGE AND HEADER */}
        <ImageBackground
            source={darkMode ? bgImageDark : bgImageLight}
            style={[ styles.headerContainer ]}
            imageStyle={{ resizeMode: "cover" }}
            >
            
            <View style={[styles.headerFlexDiv, isDesktop && { width: "40%", alignSelf: "center" },]}>

                <Text 
                accessibilityRole="header"
                accessibilityLabel="Todo list header" 
                style={[styles.header, { color: 'white' }]}>
                    TODO
                </Text>

                <Pressable 
                accessibilityRole="button"
                accessibilityLabel={darkMode ? "Switch to light mode" : "Switch to dark mode"} 
                onPress={()=> setDarkMode(!darkMode)}>
                    {darkMode ? <Sun color="white" size={45} /> :  <Moon color="white" size={45} />}
                </Pressable>
            </View>
            
        </ImageBackground>
    {/* TODO CONTAINER - INPUT AND TODO LIST  */}
    <View style={styles.todoListContainer}>
        {/* INPUT CONTAINER */}
        <View
        style={[
        styles.inputContainer,
        { backgroundColor: cardColor },
        isDesktop && { width: "40%", alignSelf: "center" },
        ]}
    >
        <Feather name="circle" size={22} color="#393A4B" style={{ marginRight: 10 }} />
        <TextInput
        accessibilityLabel="Create new todo input"
        accessibilityHint="Type your todo and press enter to add"
        value={text}
        onChangeText={setText}
        onSubmitEditing={addTask}
        placeholder="Create a new todo..."
        underlineColorAndroid="transparent"
        placeholderTextColor={darkMode ? "#9ca3af" : "#999"}
        style={[styles.input, { color: textColor }]}
        />
        </View>

        {/* Todo list */}
        <View
            style={[
            styles.todoContainer,
            { backgroundColor: cardColor },
            isDesktop && { width: "40%", alignSelf: "center" },
            { maxHeight: isDesktop ? screenHeight * 0.63 : screenHeight * 0.55 }
            ]}
        >
            <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ padding: 12 }}>            
            <AnimatedDraggableFlatList 
            itemLayoutAnimation={LinearTransition}
            keyboardDismissMode={'on-drag'}  
            data={todos ?? []}
            keyExtractor={(item: any, index: number) => (item as todo).id + index}
            nestedScrollEnabled={true}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            />
            </ScrollView>

            {/* Bottom bar */}
            <View style={[styles.footerBar, darkMode && styles.footerBarDark]}>
            <Text style={[styles.footerText, { color: textColor }]}>
                {todos?.filter((t) => !t.completed).length} items left
            </Text>

            <View style={[styles.filterContainer, !isDesktop && {display: 'none'}]}>
                {["All", "Active", "Completed"].map((tab) => (
                <Pressable 
                accessibilityRole="button"
                accessibilityLabel={`Show ${tab} todos`} 
                key={tab} 
                onPress={() => setFilter(tab)}>
                    <Text
                    style={[
                        styles.filterText,
                        { color: filter === tab ? "#818cf8" : "#9ca3af" },
                    ]}
                    >
                    {tab}
                    </Text>
                </Pressable>
                ))}
            </View>

            <Pressable 
            style={({ pressed }) => [{ opacity: pressed ? 1 : 0.6 },]} 
            onPress={clearCompleted}>
                <Text  style={[styles.footerText, { color: textColor }]}>
                Clear Completed
                </Text>
            </Pressable>
            </View>
        </View>

         <View style={[
            styles.filterContainerMobile,
            { backgroundColor: cardColor },
            isDesktop && {display: 'none'}]}>

                {["All", "Active", "Completed"].map((tab) => (
                <Pressable key={tab} onPress={() => setFilter(tab)}>
                    <Text
                    style={[
                        styles.filterText,
                        { color: filter === tab ? "#818cf8" : "#9ca3af" },
                    ]}
                    >
                    {tab}
                    </Text>
                </Pressable>
                ))}
        </View>

    </View>

      <Text
        style={[
          styles.dragText,
          { color: darkMode ? "#9ca3af" : "#6b7280" },
        ]}
      >
        Drag and drop to reorder list
      </Text>

    </SafeAreaView>
  );
}

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        position: "relative",
        paddingBottom: 30,
        width: '100%',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: "flex-start",
        width: '100%',
        height: '35%',
        flex: 1,
        resizeMode: 'cover',

    },
    headerFlexDiv:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingTop: 40,
        width: '100%',
        padding: 2,
        flex: 1,
    },
    header: {
        fontSize: 35,
        fontWeight: "bold",
        letterSpacing: 15,
        fontFamily: 'JosefinSans_500Medium'
    },
    todoListContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        top: Platform.OS === 'web' ? 120 : 150,
        left: 'auto',
    backgroundColor: 'transparent',
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        width: "90%",
        paddingHorizontal: 15,
        fontFamily: 'JosefinSans_500Medium',
    },
    input: {
        width: "100%",
        padding: 25,
        flex: 1,
        fontSize: 16,
        fontFamily: "JosefinSans_500Medium",
        borderWidth: 0,
        backgroundColor: "transparent",
        color: "#111827",
        ...(Platform.OS === "android" && { underlineColorAndroid: "transparent" }),
        // 👇 safely remove the focus ring on web
        ...((Platform.OS === "web"
        ? ({
            outlineWidth: 0,
            outlineColor: "transparent",
            outlineOffset: 0,
            } as any)
        : {}) as any),
    },
    todoContainer: {
        borderRadius: 12,
        width: "90%",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    },
    todoItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E3E4F1",
        fontFamily: 'JosefinSans_500Medium'
    },
    todoItemDark: {
        borderBottomColor: "#393A4B",
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: "#393A4B", // make this into the gradient
        marginRight: 10,
    },
    todoText: {
        fontSize: 16,
        fontFamily: 'JosefinSans_500Medium'
    },
    todoTextDark: {
        color: "#C8CBE7",
    },
    footerBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 14,
        borderTopWidth: 1,
        borderTopColor: "#E3E4F1",
    },
    footerBarDark: {
        borderTopColor: "#393A4B",
    },
    footerText: {
        fontSize: 14,
        fontFamily: 'JosefinSans_500Medium'
    },
    filterContainer: {
        flexDirection: "row",
        gap: 12,
    },
    filterContainerMobile: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        marginHorizontal: 'auto',
        flexDirection: "row",
        padding: 30,
        borderRadius: 10,
        gap: 12,
    },
    filterText: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: 'JosefinSans_500Medium'
    },
    dragText: {
        fontSize: 12,
        marginTop: 16,
        fontFamily: 'JosefinSans_500Medium'
    },
    });