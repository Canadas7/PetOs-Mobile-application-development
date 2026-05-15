import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import colors from "../styles/colors";

export default function HomeScreen({ navigation, route }: any) {
  const userName = route.params?.userName || "Tutor";
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="pets" size={34} color={colors.teal} />
          <Text style={styles.logo}>PetOS</Text>
        </View>

       <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
  </Text>
</TouchableOpacity>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.title}>Olá, {userName}!</Text>
        <Text style={styles.subtitle}>Como está o seu melhor amigo hoje?</Text>
      </View>

      <TouchableOpacity
        style={styles.petCard}
        onPress={() => navigation.navigate("PetsList")}
      >
        <View style={styles.petContent}>
          <Text style={styles.petLabel}>Meu Pet:</Text>
          <Text style={styles.petName}>Thor</Text>

          <View style={styles.petInfoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.white} />
            <Text style={styles.petInfo}>3 anos</Text>
          </View>

          <View style={styles.petInfoRow}>
            <MaterialIcons name="pets" size={16} color={colors.white} />
            <Text style={styles.petInfo}>Golden Retriever</Text>
          </View>
        </View>

        <View style={styles.petImagePlaceholder}>
          <MaterialIcons name="pets" size={64} color={colors.white} />
        </View>

        <View style={styles.petArrow}>
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </View>
      </TouchableOpacity>

      <View style={styles.whitePanel}>
        <View style={styles.cardsArea}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="medical" size={32} color={colors.teal} />
            </View>
            <Text style={styles.cardTitle}>Vacinas</Text>
            <Text style={styles.cardSub}>Próxima: 20 Jun</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.iconCircleBlue}>
              <Ionicons name="calendar" size={32} color={colors.blue} />
            </View>
            <Text style={styles.cardTitle}>Consultas</Text>
            <Text style={styles.cardSub}>2 agendadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-done" size={32} color={colors.teal} />
            </View>
            <Text style={styles.cardTitle}>Rotina</Text>
            <Text style={styles.cardSub}>4 tarefas hoje</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alertHeader}>
          <View style={styles.alertTitleBox}>
            <Ionicons name="notifications" size={22} color={colors.teal} />
            <Text style={styles.alertTitle}>Alertas</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.alertCard}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <View style={styles.alertIcon}>
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={colors.white}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.alertName}>Vacina antirrábica</Text>
            <Text style={styles.alertText}>vence em 7 dias.</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color={colors.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home" size={23} color={colors.teal} />
          <Text style={styles.navActive}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("PetsList")}
        >
          <MaterialIcons name="pets" size={23} color={colors.gray} />
          <Text style={styles.navItem}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("PetRegister")}
        >
          <Ionicons name="add-circle" size={23} color={colors.gray} />
          <Text style={styles.navItem}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="grid" size={23} color={colors.gray} />
          <Text style={styles.navItem}>Painel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 22,
    paddingTop: 48,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: {
    color: colors.primary,
    fontWeight: "800",
  },
  greeting: {
    marginTop: 28,
    marginBottom: 18,
  },
  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.mint,
    fontSize: 14,
    marginTop: 4,
  },
  petCard: {
    backgroundColor: colors.teal,
    borderRadius: 22,
    padding: 20,
    minHeight: 160,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  petContent: {
    flex: 1,
    zIndex: 2,
  },
  petLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  petName: {
    color: colors.white,
    fontSize: 42,
    fontWeight: "800",
    marginVertical: 8,
  },
  petInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  petInfo: {
    color: colors.white,
    fontSize: 14,
  },
  petImagePlaceholder: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  petArrow: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  whitePanel: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 16,
    marginTop: 18,
  },
  cardsArea: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconCircleBlue: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#E8F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  cardSub: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  alertTitleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  seeAll: {
    color: colors.teal,
    fontSize: 13,
    fontWeight: "700",
  },
  alertCard: {
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#BDEFE4",
  },
  alertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  alertName: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
  alertText: {
    color: colors.primary,
    fontSize: 13,
  },
  bottomNav: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "auto",
  },
  navButton: {
    alignItems: "center",
    gap: 4,
  },
  navActive: {
    color: colors.teal,
    fontWeight: "800",
    fontSize: 12,
  },
  navItem: {
    color: colors.gray,
    fontWeight: "700",
    fontSize: 12,
  },
});